import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function base64url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], "base64url").toString());
  } catch {
    return null;
  }
}

function createSessionJwt(payload: Record<string, unknown>, secret: string): string {
  const header = base64url(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = base64url(Buffer.from(JSON.stringify(payload)));
  const signature = base64url(createHmac("sha256", secret).update(`${header}.${body}`).digest());
  return `${header}.${body}.${signature}`;
}

const CALLBACK_PATH = "/api/auth/callback";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const ifError = url.searchParams.get("error");

  // User denied/cancelled authorization at the IF consent screen, or no code
  // was returned. IF redirects back here with error=access_denied (or similar).
  if (!code || ifError) {
    return NextResponse.redirect(
      new URL("/login?error=cancelled", process.env.NEXTAUTH_URL || request.url),
    );
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("ifc_oauth_state")?.value;
  const codeVerifier = cookieStore.get("ifc_code_verifier")?.value;

  if (!state || state !== storedState) {
    return NextResponse.redirect(
      new URL("/login?error=failed", process.env.NEXTAUTH_URL || request.url),
    );
  }

  if (!codeVerifier) {
    return NextResponse.redirect(
      new URL("/login?error=failed", process.env.NEXTAUTH_URL || request.url),
    );
  }

  let tokens: Record<string, unknown>;
  try {
    const tokenRes = await fetch("https://api.infiniteflight.com/auth/v2/connect/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.IF_OAUTH_CLIENT_ID || "",
        client_secret: process.env.IF_OAUTH_CLIENT_SECRET || "",
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL}${CALLBACK_PATH}`,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text().catch(() => "(no body)");
      console.error("IFC token exchange failed", tokenRes.status, text.slice(0, 500));
      return NextResponse.redirect(
        new URL("/login?error=failed", process.env.NEXTAUTH_URL || request.url),
      );
    }

    tokens = (await tokenRes.json()) as Record<string, unknown>;
  } catch (e) {
    console.error("IFC token exchange error", e);
    return NextResponse.redirect(
      new URL("/login?error=failed", process.env.NEXTAUTH_URL || request.url),
    );
  }

  const payload = decodeJwtPayload((tokens.access_token as string) || "") || {};
  const now = Math.floor(Date.now() / 1000);

  const name =
    (payload.name as string) ||
    (payload.preferred_username as string) ||
    (payload.nickname as string) ||
    (payload.email as string) ||
    `Pilot-${String(payload.sub || "").slice(0, 8)}`;
  const email = (payload.email as string) || "";
  const picture = (payload.picture as string) || "";
  const sub = (payload.sub as string) || (payload.id as string) || "";

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error("NEXTAUTH_SECRET is not configured");
    return NextResponse.redirect(
      new URL("/login?error=failed", process.env.NEXTAUTH_URL || request.url),
    );
  }

  const sessionToken = createSessionJwt(
    {
      name,
      email,
      picture,
      sub,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_at ? Number(tokens.expires_at) : now + 1800,
      iat: now,
      exp: now + 30 * 24 * 60 * 60,
    },
    secret,
  );

  // Success: land on the login page with a success flag so the UI can show
  // "Login successful" briefly before redirecting to the authenticated view.
  const rawRedirectTo = url.searchParams.get("callbackUrl") || "/pilots";
  const redirectTo = rawRedirectTo.startsWith("/") ? rawRedirectTo : "/pilots";
  const response = NextResponse.redirect(
    new URL(`/login?status=success&callbackUrl=${encodeURIComponent(redirectTo)}`, process.env.NEXTAUTH_URL || request.url),
  );

  response.cookies.set("ifphg_session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  // Clear the one-time PKCE exchange cookies.
  response.cookies.set("ifc_oauth_state", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });
  response.cookies.set("ifc_code_verifier", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });

  return response;
}

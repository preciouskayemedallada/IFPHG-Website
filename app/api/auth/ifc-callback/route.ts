import { randomBytes, createHash, createHmac } from "crypto";
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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", process.env.NEXTAUTH_URL || request.url));
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("ifc_oauth_state")?.value;
  const codeVerifier = cookieStore.get("ifc_code_verifier")?.value;

  if (!state || state !== storedState) {
    return NextResponse.redirect(new URL("/login?error=invalid_state", process.env.NEXTAUTH_URL || request.url));
  }

  if (!codeVerifier) {
    return NextResponse.redirect(new URL("/login?error=missing_verifier", process.env.NEXTAUTH_URL || request.url));
  }

  const tokenRes = await fetch("https://api.infiniteflight.com/auth/v2/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.IF_OAUTH_CLIENT_ID || "",
      client_secret: process.env.IF_OAUTH_CLIENT_SECRET || "",
      code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/ifc-callback`,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return NextResponse.redirect(new URL("/login?error=token_exchange_failed", process.env.NEXTAUTH_URL || request.url));
  }

  const tokens = await tokenRes.json();
  const payload = decodeJwtPayload(tokens.access_token) || {};
  const now = Math.floor(Date.now() / 1000);

  const sessionPayload = {
    name: (payload.name as string) || (payload.preferred_username as string) || "",
    email: (payload.email as string) || "",
    picture: (payload.picture as string) || "",
    sub: (payload.sub as string) || (payload.id as string) || "",
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: tokens.expires_at ? Number(tokens.expires_at) : now + 1800,
    iat: now,
    exp: now + 30 * 24 * 60 * 60,
  };

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/login?error=server_error", process.env.NEXTAUTH_URL || request.url));
  }

  const sessionToken = createSessionJwt(sessionPayload, secret);
  const rawRedirectTo = url.searchParams.get("callbackUrl") || "/pilots";
  const redirectTo = rawRedirectTo.startsWith("/") ? rawRedirectTo : "/pilots";
  const response = NextResponse.redirect(new URL(redirectTo, process.env.NEXTAUTH_URL || request.url));

  response.cookies.set("ifphg_session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

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

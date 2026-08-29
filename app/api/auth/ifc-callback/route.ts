import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], "base64url").toString());
  } catch {
    return null;
  }
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
    console.error("IFC token exchange failed", tokenRes.status, text);
    return NextResponse.redirect(new URL("/login?error=token_exchange_failed", process.env.NEXTAUTH_URL || request.url));
  }

  const tokens = await tokenRes.json();
  const payload = decodeJwtPayload(tokens.access_token) || {};
  const now = Math.floor(Date.now() / 1000);

  const form = new FormData();
  form.set("access_token", tokens.access_token);
  form.set("refresh_token", tokens.refresh_token || "");
  form.set("expires_at", String(tokens.expires_at || now + 1800));
  form.set("callbackUrl", url.searchParams.get("callbackUrl") || "/pilots");

  const signInRes = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signin/credentials?callbackUrl=${encodeURIComponent(url.searchParams.get("callbackUrl") || "/pilots")}`, {
    method: "POST",
    body: form,
    redirect: "manual",
  });

  if (!signInRes.ok) {
    console.error("NextAuth signin failed", signInRes.status);
    return NextResponse.redirect(new URL("/login?error=signin_failed", process.env.NEXTAUTH_URL || request.url));
  }

  const redirectTo = signInRes.headers.get("location") || url.searchParams.get("callbackUrl") || "/pilots";
  const response = NextResponse.redirect(new URL(redirectTo, process.env.NEXTAUTH_URL || request.url));

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

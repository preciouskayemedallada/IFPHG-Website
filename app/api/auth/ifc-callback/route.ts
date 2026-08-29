import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signIn } from "@/auth/config";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("ifc_oauth_state")?.value;
  const codeVerifier = cookieStore.get("ifc_code_verifier")?.value;

  if (!state || state !== storedState) {
    return NextResponse.redirect(new URL("/login?error=invalid_state", request.url));
  }

  if (!codeVerifier) {
    return NextResponse.redirect(new URL("/login?error=missing_verifier", request.url));
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
    return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url));
  }

  const tokens = await tokenRes.json();

  const res = await signIn("infiniteflight", {
    access_token: tokens.access_token,
    redirect: false,
  });

  if (res?.error) {
    console.error("NextAuth signIn failed", res.error);
    return NextResponse.redirect(new URL("/login?error=signin_failed", request.url));
  }

  const redirectTo = url.searchParams.get("callbackUrl") || "/pilots";
  const response = NextResponse.redirect(new URL(redirectTo, request.url));
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

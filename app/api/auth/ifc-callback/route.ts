import { NextResponse } from "next/server";
import { signIn } from "@/auth/config";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const storedState = request.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("ifc_oauth_state="))
    ?.split("=")[1];

  if (!state || state !== storedState) {
    return NextResponse.redirect(new URL("/login?error=invalid_state", request.url));
  }

  const tokenRes = await fetch("https://api.infiniteflight.com/auth/v2/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.IF_OAUTH_CLIENT_ID || "",
      code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/ifc-callback`,
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}

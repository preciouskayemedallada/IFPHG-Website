import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.IF_OAUTH_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/ifc-callback`;
  const scope =
    "openid profile offline_access live:organizations.read live:aircraft.read live:schedules.read";

  const state = Buffer.from(
    JSON.stringify({ ts: Date.now() }),
  ).toString("base64url");

  const url = new URL("https://api.infiniteflight.com/auth/v2/connect/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId || "");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.cookies.set("ifc_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}

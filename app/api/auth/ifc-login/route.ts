import { randomBytes, createHash } from "crypto";
import { NextResponse } from "next/server";

function base64url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function GET(request: Request) {
  const codeVerifier = base64url(randomBytes(32));
  const codeChallenge = base64url(createHash("sha256").update(codeVerifier).digest());

  const clientId = process.env.IF_OAUTH_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback`;
  const scope =
    "openid profile offline_access live:organizations.read live:aircraft.read live:schedules.read";

  const state = base64url(randomBytes(16));

  const url = new URL("https://api.infiniteflight.com/auth/v2/connect/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId || "");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  const accept = request.headers.get("accept") || "";
  const wantsJson = accept.includes("application/json");
  const response = wantsJson
    ? NextResponse.json({ authorizeUrl: url.toString() })
    : NextResponse.redirect(url);
  response.cookies.set("ifc_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 600,
    path: "/",
  });
  response.cookies.set("ifc_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 600,
    path: "/",
  });

  return response;
}

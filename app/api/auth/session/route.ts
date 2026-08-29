import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

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

function verifyJwt(token: string, secret: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = base64url(createHmac("sha256", secret).update(`${header}.${body}`).digest());
    if (signature !== expectedSig) return null;
    return JSON.parse(Buffer.from(body, "base64url").toString());
  } catch {
    return null;
  }
}

export async function GET() {
  const sessionToken = (await cookies()).get("ifphg_session")?.value;
  if (!sessionToken) {
    return NextResponse.json({ user: null });
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ user: null });
  }

  const payload = verifyJwt(sessionToken, secret);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  const now = Math.floor(Date.now() / 1000);
  if ((payload.exp as number) < now) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      name: payload.name,
      email: payload.email,
      image: payload.picture,
      id: payload.sub,
    },
  });
}

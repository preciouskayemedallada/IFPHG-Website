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

export async function GET() {
  const sessionToken = (await cookies()).get("ifphg_session")?.value;
  if (!sessionToken) {
    return NextResponse.json({ user: null });
  }

  const payload = decodeJwtPayload(sessionToken);
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

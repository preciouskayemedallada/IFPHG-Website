import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const bearer = process.env.IF_BEARER;
  if (!bearer) {
    return NextResponse.json({ error: "IF_BEARER not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.infiniteflight.com/public/v2/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify({ userIds: [userId] }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: res.status });
  }

  const data = await res.json();
  const user = data.result?.find((u: { userId: string }) => u.userId === userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

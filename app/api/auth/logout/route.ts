import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL || ""));
  
  response.cookies.set("ifphg_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  
  response.cookies.set("ifphg_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.session-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.session-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.csrf-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.csrf-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.callback-url", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.callback-url", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });

  return response;
}

export async function POST() {
  const response = NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL || ""));
  
  response.cookies.set("ifphg_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  
  response.cookies.set("ifphg_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.session-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.session-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.csrf-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.csrf-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.callback-url", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("next-auth.callback-url", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });

  return response;
}

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], "base64url").toString());
  } catch {
    return null;
  }
}

export const authConfig = {
  trustHost: true,
  providers: [
    {
      id: "infiniteflight",
      name: "Infinite Flight",
      type: "credentials",
      credentials: {
        access_token: { label: "Access Token", type: "text" },
        refresh_token: { label: "Refresh Token", type: "text" },
        expires_at: { label: "Expires At", type: "number" },
      },
      async authorize(credentials: { access_token?: string; refresh_token?: string; expires_at?: string }) {
        if (!credentials?.access_token) return null;
        const payload = decodeJwtPayload(credentials.access_token);
        if (!payload) return null;
        return {
          id: (payload.sub as string) || (payload.id as string) || "",
          name: (payload.name as string) || (payload.preferred_username as string) || "",
          email: (payload.email as string) || "",
          image: (payload.picture as string) || "",
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token,
          expires_at: credentials.expires_at,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { access_token?: string }).access_token;
        token.refreshToken = (user as { refresh_token?: string }).refresh_token;
        token.expiresAt = (user as { expires_at?: number }).expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string | undefined;
        session.refreshToken = token.refreshToken as string | undefined;
        session.expiresAt = token.expiresAt as number | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

export type Session = typeof auth;

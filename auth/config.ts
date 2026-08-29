import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  providers: [
    {
      id: "infiniteflight",
      name: "Infinite Flight",
      type: "credentials",
      credentials: {
        access_token: { label: "Access Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.access_token) return null;
        const res = await fetch("https://api.infiniteflight.com/connect/userinfo", {
          headers: { Authorization: `Bearer ${credentials.access_token}` },
        });
        if (!res.ok) return null;
        const profile = await res.json();
        return {
          id: profile.sub || profile.id,
          name: profile.name || profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
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

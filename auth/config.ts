import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  providers: [
    {
      id: "infiniteflight",
      name: "Infinite Flight",
      type: "oauth",
      authorization: {
        url: "https://api.infiniteflight.com/auth/v2/connect/authorize",
        params: {
          response_type: "code",
          scope:
            "openid profile offline_access live:organizations.read live:aircraft.read live:schedules.read",
        },
      },
      token: "https://api.infiniteflight.com/auth/v2/connect/token",
      userinfo: "https://api.infiniteflight.com/connect/userinfo",
      clientId: process.env.IF_OAUTH_CLIENT_ID,
      clientSecret: process.env.IF_OAUTH_CLIENT_SECRET,
      profile(profile) {
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
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.expiresAt = token.expiresAt as number;
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

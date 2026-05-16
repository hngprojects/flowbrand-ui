import { NextAuthConfig, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { nextLogin, googleAuth } from "~/actions/nextauth";
import { inDevEnvironment } from "@/lib/utils";
import { LoginSchema } from "@/schema/auth.schema";
import { CustomJWT } from "@/types/auth";

const INVALID_CREDENTIAL_STATUSES = new Set([400, 401, 403, 422]);
const AUTH_SECRET_FALLBACK =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV !== "production" ? "flowbrand-dev-secret" : undefined);

const googleConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID) &&
  Boolean(process.env.AUTH_GOOGLE_SECRET);

const authConfig: NextAuthConfig = {
  providers: [
    ...(googleConfigured
      ? [
          Google({
            checks: ["none"],
          }),
        ]
      : []),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        const { email, password, rememberMe } = validatedFields.data;
        const response = await nextLogin({ email, password, rememberMe });

        if (!response.success) {
          const statusCode =
            "status_code" in response ? (response.status_code ?? 0) : 0;
          if (INVALID_CREDENTIAL_STATUSES.has(statusCode)) {
            return null;
          }

          throw new Error(response.message);
        }

        if (!("data" in response)) {
          throw new Error("Login response is missing user data");
        }

        const user = response.data as CustomJWT;
        user.access_token = response.access_token;
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  debug: inDevEnvironment,
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      return !!user;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        if (!account?.id_token) {
          return token;
        }
        const response = await googleAuth(account?.id_token);
        if (!response || !("data" in response)) {
          return token;
        }
        token = response.data as CustomJWT;
        token.access_token = response.access_token;
        return token;
      }

      return {
        ...token,
        ...user,
      } as CustomJWT;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const customToken = token as CustomJWT;
      if (!customToken || !customToken.id) {
        return {
          ...session,
          user: {
            id: "",
            first_name: "",
            last_name: "",
            email: "",
            image: "",
          },
          access_token: undefined,
          userOrg: undefined,
          currentOrgId: undefined,
          expires: new Date(0).toISOString(),
        };
      }

      session.user = {
        id: customToken.id as string,
        first_name: customToken.first_name,
        last_name: customToken.last_name,
        image: customToken.avatar_url || "",
        email: customToken.email as string,
      };
      session.access_token = customToken.access_token;
      session.userOrg = customToken.organisations;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  basePath: "/api/auth",
  secret: AUTH_SECRET_FALLBACK,
  trustHost: true,
} satisfies NextAuthConfig;

export default authConfig;

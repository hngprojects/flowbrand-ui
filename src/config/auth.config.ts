import { NextAuthConfig, Session } from "next-auth";
import { CredentialsSignin } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { credentialsAuth } from "~/actions/auth";
import { inDevEnvironment } from "@/lib/utils";
import { LoginSchema } from "@/schema/auth.schema";
import { CustomJWT } from "@/types/auth";

const INVALID_CREDENTIAL_STATUSES = new Set([400, 401, 403, 422, 502]);

function readAuthSecret(): string | undefined {
  const value =
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    "";
  return value.length > 0 ? value : undefined;
}

const AUTH_SECRET_FALLBACK =
  readAuthSecret() ??
  (process.env.NODE_ENV !== "production" ? "seil-dev-secret" : undefined);

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          if (inDevEnvironment) {
            console.warn(
              "[auth] Login validation failed",
              validatedFields.error,
            );
          }
          return null;
        }

        const { email, password, rememberMe } = validatedFields.data;
        const response = await credentialsAuth({ email, password, rememberMe });

        if (!response.success) {
          const statusCode =
            "status_code" in response ? (response.status_code ?? 0) : 0;

          if (inDevEnvironment) {
            console.warn("[auth] Login failed", {
              statusCode,
              message: response.message,
            });
          }

          if (INVALID_CREDENTIAL_STATUSES.has(statusCode)) {
            throw new CredentialsSignin(response.message);
          }

          throw new Error(response.message);
        }

        if (!("data" in response) || !response.data?.id) {
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
    async jwt({ token, user }) {
      return {
        ...token,
        ...user,
      } as CustomJWT;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const customToken = token as CustomJWT;
      if (!customToken?.id) {
        console.warn("[auth] Rejecting session: JWT missing backend user id", {
          sub: customToken?.sub,
          email: customToken?.email,
        });
        return {
          expires: new Date(0).toISOString(),
          invalid: true,
        } as Session;
      }

      session.user = {
        id: customToken.id as string,
        first_name: customToken.first_name ?? "",
        last_name: customToken.last_name ?? "",
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

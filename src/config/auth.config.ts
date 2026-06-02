import { NextAuthConfig, Session } from "next-auth";
import { CredentialsSignin } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { credentialsAuth } from "@/lib/credentials-auth";
import { envConfig } from "@/config/env.config";
// import { fetchAuthMe } from "@/lib/auth-api";
import { fetchAuthMe } from "@/lib/auth-api";
import { refreshAccessToken } from "@/lib/auth-api-server";
import { inDevEnvironment } from "@/lib/utils";
import { loginFailureCode } from "@/lib/login-errors";
import { LoginCredentialsSchema } from "@/schema/auth.schema";
import { CustomJWT } from "@/types/auth";

/** Surfaces API failure as Auth.js `code` for client signIn(redirect: false). */
class LoginFailure extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
  }
}

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
/** Backend access tokens are ~15m; refresh slightly before expiry. */
const ACCESS_TOKEN_LIFETIME_MS = 1000 * 60 * 14;

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginCredentialsSchema.safeParse(credentials);
        if (!validatedFields.success) {
          if (inDevEnvironment) {
            console.warn(
              "[auth] Login validation failed",
              validatedFields.error.flatten(),
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

          throw new LoginFailure(
            loginFailureCode(statusCode, response.message),
          );
        }

        if (!("data" in response) || !response.data?.id) {
          throw new Error("Login response is missing user data");
        }

        const user = response.data as CustomJWT;
        user.access_token = response.access_token;
        return user;
      },
    }),
    Credentials({
      id: "access-token",
      credentials: {
        accessToken: { label: "Access Token", type: "password" },
      },
      async authorize(credentials) {
        const accessToken =
          typeof credentials?.accessToken === "string"
            ? credentials.accessToken.trim()
            : "";
        if (!accessToken) {
          return null;
        }

        const me = await fetchAuthMe(envConfig.BASEURL, accessToken);
        if (!me) {
          return null;
        }

        const fullName = me.full_name?.trim() ?? "";
        const spaceIndex = fullName.indexOf(" ");
        const user: CustomJWT = {
          id: me.id,
          email: me.email,
          first_name:
            spaceIndex === -1 ? fullName : fullName.slice(0, spaceIndex),
          last_name:
            spaceIndex === -1 ? "" : fullName.slice(spaceIndex + 1).trim(),
          access_token: accessToken,
        };
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  debug: process.env.AUTH_DEBUG === "true",

  callbacks: {
    async jwt({ token, user }) {
      const customToken = token as CustomJWT;

      /**
       * Initial login
       */
      if (user) {
        const incomingUser = user as CustomJWT;

        return {
          ...customToken,
          ...incomingUser,
          access_token: incomingUser.access_token,
          expires_at: Date.now() + ACCESS_TOKEN_LIFETIME_MS,
          error: undefined,
        } satisfies CustomJWT;
      }

      /**
       * Existing token still valid
       */
      if (customToken.expires_at && Date.now() < customToken.expires_at) {
        return customToken;
      }

      /**
       * Refresh expired access token
       */
      const refreshed = await refreshAccessToken(envConfig.BASEURL);

      if (!refreshed?.access_token) {
        return {
          ...customToken,
          error: "RefreshAccessTokenError",
        } satisfies CustomJWT;
      }

      return {
        ...customToken,
        access_token: refreshed.access_token,
        expires_at: Date.now() + ACCESS_TOKEN_LIFETIME_MS,
        error: undefined,
      } satisfies CustomJWT;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      const customToken = token as CustomJWT;

      if (!customToken?.id) {
        if (inDevEnvironment) {
          console.warn(
            "[auth] Rejecting session: JWT missing backend user id",
            {
              sub: customToken?.sub,
              email: customToken?.email,
            },
          );
        }

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

      session.invalid = customToken.error === "RefreshAccessTokenError";

      return session;
    },
  },

  // callbacks: {
  //   async jwt({ token, user }) {
  //     return {
  //       ...token,
  //       ...user,
  //     } as CustomJWT;
  //   },
  //   async session({ session, token }: { session: Session; token: JWT }) {
  //     const customToken = token as CustomJWT;
  //     if (!customToken?.id) {
  //       console.warn("[auth] Rejecting session: JWT missing backend user id", {
  //         sub: customToken?.sub,
  //         email: customToken?.email,
  //       });
  //       return {
  //         expires: new Date(0).toISOString(),
  //         invalid: true,
  //       } as Session;
  //     }

  //     session.user = {
  //       id: customToken.id as string,
  //       first_name: customToken.first_name ?? "",
  //       last_name: customToken.last_name ?? "",
  //       image: customToken.avatar_url || "",
  //       email: customToken.email as string,
  //     };
  //     session.access_token = customToken.access_token;
  //     session.userOrg = customToken.organisations;

  //     return session;
  //   },
  // },
  pages: {
    signIn: "/login",
  },
  basePath: "/api/auth",
  secret: AUTH_SECRET_FALLBACK,
  trustHost: true,
} satisfies NextAuthConfig;

export default authConfig;

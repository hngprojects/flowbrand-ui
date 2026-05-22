/** Where the API should redirect after Google OAuth (set FRONTEND_URL on the API). */
export const GOOGLE_OAUTH_CALLBACK_PATH = "/api/oauth/google/callback";

/** Starts OAuth: `GET {BASE_URL}/auth/google` → Google → API callback → app callback URL. */
export function googleOAuthStartUrl(apiBaseUrl: string): string {
  return `${apiBaseUrl.replace(/\/$/, "")}/auth/google`;
}

export function googleOAuthCallbackUrl(appUrl: string): string {
  return `${appUrl.replace(/\/$/, "")}${GOOGLE_OAUTH_CALLBACK_PATH}`;
}

export type GoogleOAuthCallbackParams = {
  accessToken?: string;
  redirectUrl?: string;
  error?: string;
};

export function parseGoogleOAuthCallbackParams(
  searchParams: URLSearchParams,
): GoogleOAuthCallbackParams {
  const accessToken =
    searchParams.get("access_token") ??
    searchParams.get("accessToken") ??
    searchParams.get("token") ??
    undefined;

  const redirectUrl =
    searchParams.get("redirectUrl") ??
    searchParams.get("redirect_url") ??
    undefined;

  const error =
    searchParams.get("error") ??
    searchParams.get("message") ??
    (searchParams.get("success") === "false"
      ? "Google sign-in was not completed."
      : undefined);

  return {
    accessToken: accessToken?.trim() || undefined,
    redirectUrl: redirectUrl?.trim() || undefined,
    error: error?.trim() || undefined,
  };
}

/** Tokens sometimes arrive in the URL hash after redirect. */
export function parseGoogleOAuthHashParams(
  hash: string,
): Pick<GoogleOAuthCallbackParams, "accessToken" | "error"> {
  if (!hash || hash === "#") {
    return {};
  }

  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);

  const accessToken =
    params.get("access_token") ??
    params.get("accessToken") ??
    params.get("token") ??
    undefined;

  const error = params.get("error") ?? params.get("message") ?? undefined;

  return {
    accessToken: accessToken?.trim() || undefined,
    error: error?.trim() || undefined,
  };
}

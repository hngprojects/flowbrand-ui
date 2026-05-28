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
  /** Single-use Redis exchange code from the API redirect. */
  code?: string;
  accessToken?: string;
  redirectUrl?: string;
  error?: string;
};

export function parseGoogleOAuthCallbackParams(
  searchParams: URLSearchParams,
): GoogleOAuthCallbackParams {
  const code = searchParams.get("code")?.trim() || undefined;

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
    code,
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

/** True when the URL carries Google OAuth callback data (not OTP-style short codes). */
export function hasGoogleOAuthExchangeParams(
  searchParams: URLSearchParams,
): boolean {
  const { code, accessToken, error } =
    parseGoogleOAuthCallbackParams(searchParams);

  if (error || accessToken) {
    return true;
  }

  if (!code) {
    return false;
  }

  return code.length >= 32;
}

export function buildGoogleOAuthCallbackUrl(
  origin: string,
  searchParams: URLSearchParams,
): URL {
  const target = new URL(GOOGLE_OAUTH_CALLBACK_PATH, origin);
  searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });
  return target;
}

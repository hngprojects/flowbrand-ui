/** Where the API should redirect after Google OAuth (set FRONTEND_URL on the API). */
export const GOOGLE_OAUTH_CALLBACK_PATH = "/api/oauth/google/callback";

export const GOOGLE_OAUTH_START_PATH = "/api/oauth/google/start";

const GOOGLE_SELECT_ACCOUNT_KEY = "flowbrand-google-select-account";

export const GOOGLE_SELECT_ACCOUNT_QUERY = "google_select_account";

/** Append a logout marker so /login knows to show the Google account picker. */
export function appendGoogleSelectAccountToPath(path: string): string {
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.set(GOOGLE_SELECT_ACCOUNT_QUERY, "1");
  return `${pathname}?${params.toString()}`;
}

/** Set after logout so the next Google sign-in shows the account picker. */
export function markGoogleAccountSelectionOnNextSignIn(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GOOGLE_SELECT_ACCOUNT_KEY, "1");
  } catch {
    // Storage disabled.
  }
}

/** Whether the next Google sign-in should show the account picker. */
export function readGoogleAccountSelectionPrompt(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get(GOOGLE_SELECT_ACCOUNT_QUERY) === "1") {
      return true;
    }
    return localStorage.getItem(GOOGLE_SELECT_ACCOUNT_KEY) === "1";
  } catch {
    return false;
  }
}

/** Clear logout markers after starting Google OAuth. */
export function clearGoogleAccountSelectionPrompt(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GOOGLE_SELECT_ACCOUNT_KEY);

    const params = new URLSearchParams(window.location.search);
    if (!params.has(GOOGLE_SELECT_ACCOUNT_QUERY)) return;

    params.delete(GOOGLE_SELECT_ACCOUNT_QUERY);
    const nextQuery = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`,
    );
  } catch {
    // Storage or history API unavailable.
  }
}

type GoogleOAuthStartOptions = {
  /** Ask Google to show the account chooser (survives app logout). */
  promptSelectAccount?: boolean;
};

/**
 * Starts OAuth via the app proxy so we can append Google params the API omits.
 * `GET /api/oauth/google/start` → Google → API callback → app callback URL.
 */
export function googleOAuthStartUrl(
  appUrl: string,
  options: GoogleOAuthStartOptions = {},
): string {
  const url = new URL(GOOGLE_OAUTH_START_PATH, appUrl.replace(/\/$/, ""));
  if (options.promptSelectAccount) {
    url.searchParams.set("prompt", "select_account");
  }
  return url.toString();
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

/** User-facing copy when credentials are rejected (matches API message). */
export const INVALID_LOGIN_MESSAGE = "Invalid email or password";

export const EMAIL_VERIFICATION_REQUIRED_CODE = "email_verification_required";

export const EMAIL_VERIFICATION_REQUIRED_MESSAGE =
  "Please verify your email address before logging in.";

export const ACCOUNT_LOCKED_CODE = "account_locked";

export const ACCOUNT_LOCKED_MESSAGE =
  "Too many failed login attempts. Your account has been locked for 1 hour.";

export const RATE_LIMITED_CODE = "rate_limited";

export const RATE_LIMITED_MESSAGE =
  "Too many requests. Please wait a moment and try again.";

export const LOGIN_FAILED_CODE = "login_failed";

type SignInResult = {
  ok: boolean;
  error?: string;
  code?: string;
};

export function isEmailVerificationRequiredResponse(
  statusCode: number | undefined,
  message: string | undefined,
): boolean {
  const text = (message ?? "").toLowerCase().trim();
  if (!text) return false;

  const mentionsEmailVerification =
    text.includes("verify") &&
    (text.includes("email") || text.includes("e-mail"));

  if (statusCode === 403 && mentionsEmailVerification) {
    return true;
  }

  return (
    mentionsEmailVerification &&
    (text.includes("before log") ||
      text.includes("before logging") ||
      text.includes("to log in") ||
      text.includes("not verified") ||
      text.includes("unverified"))
  );
}

export function isEmailVerificationSignInCode(code?: string): boolean {
  return code?.trim() === EMAIL_VERIFICATION_REQUIRED_CODE;
}

export function isAccountLockedResponse(
  statusCode: number | undefined,
  message: string | undefined,
): boolean {
  if (statusCode === 423) return true;
  const text = (message ?? "").toLowerCase();
  return text.includes("locked") || text.includes("too many failed login");
}

export function isAccountLockedSignInCode(code?: string): boolean {
  return code?.trim() === ACCOUNT_LOCKED_CODE;
}

/** Map API login failure to a safe Auth.js `code` (shown in callback URL). */
export function loginFailureCode(
  statusCode: number | undefined,
  message: string | undefined,
): string {
  if (isEmailVerificationRequiredResponse(statusCode, message)) {
    return EMAIL_VERIFICATION_REQUIRED_CODE;
  }
  if (isAccountLockedResponse(statusCode, message)) {
    return ACCOUNT_LOCKED_CODE;
  }
  if (statusCode === 429) {
    return RATE_LIMITED_CODE;
  }
  if (statusCode !== undefined && [400, 401, 422].includes(statusCode)) {
    return "invalid_email_or_password";
  }
  return LOGIN_FAILED_CODE;
}

/** Parse Auth.js callback URL params (signIn with redirect: false). */
export function parseSignInCallbackParams(callbackUrl?: string | null): {
  error?: string;
  code?: string;
} {
  if (!callbackUrl?.trim()) {
    return {};
  }

  try {
    const parsed = callbackUrl.startsWith("http")
      ? new URL(callbackUrl)
      : new URL(callbackUrl, "http://localhost");
    return {
      error: parsed.searchParams.get("error") ?? undefined,
      code: parsed.searchParams.get("code") ?? undefined,
    };
  } catch {
    return {};
  }
}

export function isSignInVerificationRequired(
  response: SignInResult | undefined,
  callbackUrl?: string | null,
): boolean {
  if (isEmailVerificationSignInCode(response?.code)) {
    return true;
  }

  const fromUrl = parseSignInCallbackParams(callbackUrl);
  if (isEmailVerificationSignInCode(fromUrl.code)) {
    return true;
  }

  return getLoginErrorMessage(response) === EMAIL_VERIFICATION_REQUIRED_MESSAGE;
}

export function isSignInFailure(
  response: SignInResult | undefined,
): response is SignInResult {
  return !response?.ok || Boolean(response.error);
}

/** Map NextAuth signIn() result to a message (error is usually `CredentialsSignin`). */
export function getLoginErrorMessage(
  response: SignInResult | undefined,
): string {
  const code = response?.code?.trim();
  if (isEmailVerificationSignInCode(code)) {
    return EMAIL_VERIFICATION_REQUIRED_MESSAGE;
  }
  if (isAccountLockedSignInCode(code)) {
    return ACCOUNT_LOCKED_MESSAGE;
  }
  if (code === RATE_LIMITED_CODE) {
    return RATE_LIMITED_MESSAGE;
  }
  if (code === "invalid_email_or_password") {
    return INVALID_LOGIN_MESSAGE;
  }
  if (code === LOGIN_FAILED_CODE) {
    return "Unable to sign in. Please try again.";
  }

  const error = response?.error?.trim();
  if (error && error !== "CredentialsSignin" && error !== "credentials") {
    return error;
  }

  return INVALID_LOGIN_MESSAGE;
}

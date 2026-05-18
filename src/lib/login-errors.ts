/** User-facing copy when credentials are rejected (matches API message). */
export const INVALID_LOGIN_MESSAGE = "Invalid email or password";

type SignInResult = {
  ok: boolean;
  error?: string;
  code?: string;
};

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
  if (code === "invalid_email_or_password") {
    return INVALID_LOGIN_MESSAGE;
  }
  if (code && code !== "credentials" && code !== "CredentialsSignin") {
    return code.replace(/_/g, " ");
  }

  const error = response?.error?.trim();
  if (error && error !== "CredentialsSignin" && error !== "credentials") {
    return error;
  }

  return INVALID_LOGIN_MESSAGE;
}

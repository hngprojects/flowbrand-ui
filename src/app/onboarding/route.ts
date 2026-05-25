import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import { envConfig } from "@/config/env.config";
import { exchangeGoogleOAuthCode, fetchAuthMe } from "@/lib/auth-api";
import { withGoogleSignInSuccessQuery } from "@/lib/google-sign-in-toast";
import {
  hasGoogleOAuthExchangeParams,
  parseGoogleOAuthCallbackParams,
} from "@/lib/google-oauth";
import { isSignInFailure } from "@/lib/login-errors";
import { resolvePostAuthPath } from "@/lib/post-auth-redirect";
import { mapApiRedirectToAppPath, ONBOARDING_UPLOAD_ROUTE } from "@/routes";

function loginError(origin: string, reason: string) {
  console.error("[google-oauth] /onboarding callback failed:", reason);
  return NextResponse.redirect(new URL("/login?google_error=1", origin));
}

/**
 * The API redirects here after Google OAuth: FRONTEND_URL/onboarding?code=...
 * With OAuth params: exchange the code, set the NextAuth session, route the user.
 * Without params: a normal visit to the onboarding wizard.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const params = requestUrl.searchParams;

  if (!hasGoogleOAuthExchangeParams(params)) {
    return NextResponse.redirect(
      new URL(ONBOARDING_UPLOAD_ROUTE, requestUrl.origin),
    );
  }

  const { code, accessToken, error, redirectUrl } =
    parseGoogleOAuthCallbackParams(params);

  if (error) return loginError(requestUrl.origin, `provider error: ${error}`);

  let token = accessToken;
  let apiRedirectUrl = redirectUrl;

  if (!token && code) {
    const exchanged = await exchangeGoogleOAuthCode(envConfig.BASEURL, code);
    if (!exchanged)
      return loginError(
        requestUrl.origin,
        "exchange returned null (see exchange log)",
      );
    token = exchanged.access_token;
    apiRedirectUrl = exchanged.redirect_url ?? apiRedirectUrl;
  }

  if (!token) return loginError(requestUrl.origin, "no token after exchange");

  let me;
  try {
    me = await fetchAuthMe(envConfig.BASEURL, token);
  } catch {
    return loginError(requestUrl.origin, "fetchAuthMe threw");
  }

  const destination =
    mapApiRedirectToAppPath(apiRedirectUrl) ?? resolvePostAuthPath(me);

  try {
    const result = await signIn("access-token", {
      accessToken: token,
      redirect: false,
    });
    if (isSignInFailure(result))
      return loginError(requestUrl.origin, "NextAuth sign-in failed");
  } catch {
    return loginError(requestUrl.origin, "signIn threw");
  }

  return NextResponse.redirect(
    new URL(withGoogleSignInSuccessQuery(destination), requestUrl.origin),
  );
}

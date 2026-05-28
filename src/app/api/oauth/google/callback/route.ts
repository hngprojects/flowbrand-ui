import { signIn } from "@/auth";
import { envConfig } from "@/config/env.config";
import { exchangeGoogleOAuthCode, fetchAuthMe } from "@/lib/auth-api";
import { withGoogleSignInSuccessQuery } from "@/lib/google-sign-in-toast";
import { parseGoogleOAuthCallbackParams } from "@/lib/google-oauth";
import { isSignInFailure } from "@/lib/login-errors";
import { resolvePostAuthPath } from "@/lib/post-auth-redirect";
import { mapApiRedirectToAppPath } from "@/routes";

function loginErrorRedirect() {
  const errUrl = new URL("/login?google_error=1", envConfig.APP_URL);
  return errUrl;
}

/** After API Google OAuth: exchange code (or legacy token), set session, redirect. */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { code, accessToken, error, redirectUrl } =
    parseGoogleOAuthCallbackParams(requestUrl.searchParams);

  if (error) {
    return Response.redirect(loginErrorRedirect());
  }

  let token = accessToken;
  let apiRedirectUrl = redirectUrl;

  if (!token && code) {
    const exchanged = await exchangeGoogleOAuthCode(envConfig.BASEURL, code);
    if (!exchanged) {
      return Response.redirect(loginErrorRedirect());
    }
    token = exchanged.access_token;
    apiRedirectUrl = exchanged.redirect_url ?? apiRedirectUrl;
  }

  if (!token) {
    return Response.redirect(loginErrorRedirect());
  }

  let me;
  try {
    me = await fetchAuthMe(envConfig.BASEURL, token);
  } catch {
    return Response.redirect(loginErrorRedirect());
  }

  const destination =
    mapApiRedirectToAppPath(apiRedirectUrl) ?? resolvePostAuthPath(me);

  try {
    const signInResult = await signIn("access-token", {
      accessToken: token,
      redirect: false,
    });

    if (isSignInFailure(signInResult)) {
      return Response.redirect(loginErrorRedirect());
    }
  } catch {
    return Response.redirect(loginErrorRedirect());
  }

  const successUrl = new URL(
    withGoogleSignInSuccessQuery(destination),
    envConfig.APP_URL,
  );

  return Response.redirect(successUrl);
}

import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn } from "@/auth";
import { envConfig } from "@/config/env.config";
import { fetchAuthMe } from "@/lib/auth-api";
import { parseGoogleOAuthCallbackParams } from "@/lib/google-oauth";
import { resolvePostAuthPath } from "@/lib/post-auth-redirect";
import { mapApiRedirectToAppPath } from "@/routes";

function loginErrorRedirect(origin: string) {
  return new URL("/login?google_error=1", origin);
}

/** After API Google OAuth: set session cookie and redirect into the app. */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { accessToken, error, redirectUrl } = parseGoogleOAuthCallbackParams(
    requestUrl.searchParams,
  );

  if (error || !accessToken) {
    return Response.redirect(loginErrorRedirect(requestUrl.origin));
  }

  let me;
  try {
    me = await fetchAuthMe(envConfig.BASEURL, accessToken);
  } catch {
    return Response.redirect(loginErrorRedirect(requestUrl.origin));
  }

  const destination =
    mapApiRedirectToAppPath(redirectUrl) ?? resolvePostAuthPath(me);

  try {
    return await signIn("access-token", {
      accessToken,
      redirectTo: destination,
    });
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }
    if (err instanceof AuthError) {
      return Response.redirect(loginErrorRedirect(requestUrl.origin));
    }
    throw err;
  }
}

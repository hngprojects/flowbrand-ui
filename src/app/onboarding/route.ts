import {
  buildGoogleOAuthCallbackUrl,
  hasGoogleOAuthExchangeParams,
} from "@/lib/google-oauth";
import { envConfig } from "@/config/env.config";
import { ONBOARDING_UPLOAD_ROUTE } from "@/routes";

/**
 * API may redirect Google OAuth to `/onboarding?code=...` (no page at this path).
 * Exchange via the OAuth callback handler, or send users to dashboard onboarding.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);

  if (hasGoogleOAuthExchangeParams(url.searchParams)) {
    // Use envConfig.APP_URL — request.url's origin can be localhost behind
    // proxies / on serverless platforms, which would break the redirect in
    // production.
    return Response.redirect(
      buildGoogleOAuthCallbackUrl(envConfig.APP_URL, url.searchParams),
    );
  }

  return Response.redirect(new URL(ONBOARDING_UPLOAD_ROUTE, envConfig.APP_URL));
}

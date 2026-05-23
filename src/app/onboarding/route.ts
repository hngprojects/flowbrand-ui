import {
  buildGoogleOAuthCallbackUrl,
  hasGoogleOAuthExchangeParams,
} from "@/lib/google-oauth";
import { ONBOARDING_UPLOAD_ROUTE } from "@/routes";

/**
 * API may redirect Google OAuth to `/onboarding?code=...` (no page at this path).
 * Exchange via the OAuth callback handler, or send users to dashboard onboarding.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);

  if (hasGoogleOAuthExchangeParams(url.searchParams)) {
    return Response.redirect(
      buildGoogleOAuthCallbackUrl(url.origin, url.searchParams),
    );
  }

  return Response.redirect(new URL(ONBOARDING_UPLOAD_ROUTE, url.origin));
}

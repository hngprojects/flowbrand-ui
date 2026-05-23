import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";
import { fetchAuthMe } from "@/lib/auth-api";
import { resolvePostAuthPath } from "@/lib/post-auth-redirect";

/** `/dashboard` has no UI — send users to strategy or onboarding upload. */
export default async function DashboardIndexPage() {
  const session = await auth();
  const accessToken = session?.access_token;

  if (
    !session?.user?.id ||
    session.invalid === true ||
    typeof accessToken !== "string"
  ) {
    redirect("/login");
  }

  const me = await fetchAuthMe(envConfig.BASEURL, accessToken);
  redirect(resolvePostAuthPath(me));
}

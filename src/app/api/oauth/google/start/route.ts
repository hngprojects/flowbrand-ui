import { NextResponse } from "next/server";
import { envConfig } from "@/config/env.config";

/** Proxies backend /auth/google and can append Google OAuth params (e.g. account picker). */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const promptSelectAccount =
    requestUrl.searchParams.get("prompt") === "select_account";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let backendResponse: Response;
  try {
    backendResponse = await fetch(
      `${envConfig.BASEURL.replace(/\/$/, "")}/auth/google`,
      {
        redirect: "manual",
        cache: "no-store",
        signal: controller.signal,
      },
    );
  } catch {
    return NextResponse.json(
      { message: "Could not reach authentication service." },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }

  const location = backendResponse.headers.get("location");
  if (!location) {
    return NextResponse.json(
      { message: "Google sign-in is unavailable." },
      { status: 502 },
    );
  }

  let googleUrl: URL;
  try {
    googleUrl = new URL(location);
  } catch {
    return NextResponse.json(
      { message: "Invalid Google sign-in redirect." },
      { status: 502 },
    );
  }

  if (
    googleUrl.protocol !== "https:" ||
    googleUrl.hostname !== "accounts.google.com"
  ) {
    return NextResponse.json(
      { message: "Unexpected authentication redirect." },
      { status: 502 },
    );
  }

  if (promptSelectAccount) {
    googleUrl.searchParams.set("prompt", "select_account");
  }

  const response = NextResponse.redirect(googleUrl.toString());
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Vary", "prompt");
  return response;
}

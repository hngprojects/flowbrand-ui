import { NextResponse } from "next/server";
import axios from "axios";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";

/** BFF for onboarding questionnaire submit — proxies to the backend when configured. */
export async function POST(request: Request) {
  const session = await auth();
  const accessToken = session?.access_token;

  if (!session?.user?.id || session.invalid === true || !accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const base = envConfig.BASEURL.replace(/\/$/, "");
  const candidates = ["/api/onboarding", "/api/strategy/onboarding"];

  let lastError: string | undefined;

  for (const path of candidates) {
    try {
      const response = await axios.post(`${base}${path}`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 30_000,
      });
      return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        lastError = `No route at ${path}`;
        continue;
      }
      const message =
        axios.isAxiosError(error) && error.response
          ? ((error.response.data as { message?: string })?.message ??
            "Onboarding submission failed.")
          : "Onboarding submission failed.";
      return NextResponse.json(
        { message },
        {
          status:
            axios.isAxiosError(error) && error.response?.status
              ? error.response.status
              : 502,
        },
      );
    }
  }

  if (process.env.NODE_ENV === "development" && lastError) {
    console.warn("[onboarding] No backend route matched:", lastError);
  }

  return NextResponse.json(
    { message: "Onboarding is not configured yet." },
    { status: 501 },
  );
}

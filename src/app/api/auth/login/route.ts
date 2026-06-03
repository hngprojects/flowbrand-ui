import { NextResponse } from "next/server";
import { envConfig } from "@/config/env.config";
import { loginWithCookieForward } from "@/lib/auth-api";
import { appendAuthSetCookieHeaders } from "@/lib/auth-cookies";
import { loginFailureCode } from "@/lib/login-errors";
import { LoginSchema } from "@/schema/auth.schema";

/** Proxies password login so the browser receives the refresh-token httpOnly cookie. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Enter a valid email and password." },
      { status: 400 },
    );
  }

  const result = await loginWithCookieForward(envConfig.BASEURL, {
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        message: result.message,
        code: loginFailureCode(result.status, result.message),
      },
      { status: result.status },
    );
  }

  const response = NextResponse.json({
    access_token: result.access_token,
    user: result.user,
  });
  appendAuthSetCookieHeaders(response, result.setCookieHeaders);
  return response;
}

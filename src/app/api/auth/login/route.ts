import { NextResponse } from "next/server";
import { envConfig } from "@/config/env.config";
import { loginWithCookieForward } from "@/lib/auth-api";
import { loginFailureCode } from "@/lib/login-errors";
import { LoginSchema } from "@/schema/auth.schema";

function applySetCookieHeaders(response: NextResponse, headers: string[]) {
  for (const header of headers) {
    response.headers.append("Set-Cookie", header);
  }
}

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
  applySetCookieHeaders(response, result.setCookieHeaders);
  return response;
}

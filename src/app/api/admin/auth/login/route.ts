import { NextResponse } from "next/server";
import { z } from "zod";
import { envConfig } from "@/config/env.config";
import { adminLoginWithCookieForward } from "@/lib/admin-api";
import { appendAuthSetCookieHeaders } from "@/lib/auth-cookies";

const AdminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

/** Proxies admin login so the browser receives the refreshToken HttpOnly cookie. */
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

  const parsed = AdminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Enter a valid email and password." },
      { status: 400 },
    );
  }

  const result = await adminLoginWithCookieForward(envConfig.BASEURL, {
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  const response = NextResponse.json({ access_token: result.access_token });
  appendAuthSetCookieHeaders(response, result.setCookieHeaders);
  return response;
}

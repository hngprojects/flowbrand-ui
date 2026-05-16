import { NextResponse } from "next/server";
import { envConfig } from "@/config/env.config";

export async function POST(request: Request) {
  const baseUrl = envConfig.BASEURL;
  if (!baseUrl) {
    return NextResponse.json(
      { message: "API base URL is not configured" },
      { status: 503 },
    );
  }

  let id_token: string | undefined;
  try {
    const body = (await request.json()) as { id_token?: string };
    id_token = body.id_token;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!id_token) {
    return NextResponse.json(
      { message: "id_token is required" },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(`${baseUrl}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token }),
    });

    const payload = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      const message =
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string"
          ? payload.message
          : "Google sign-in failed";
      return NextResponse.json({ message }, { status: upstream.status });
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { message: "Unable to reach authentication service" },
      { status: 502 },
    );
  }
}

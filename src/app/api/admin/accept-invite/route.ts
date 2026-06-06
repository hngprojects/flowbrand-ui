import axios from "axios";
import { NextResponse } from "next/server";
import { envConfig } from "@/config/env.config";
import { adminApiUrl } from "@/lib/admin-api";
/** Public BFF for team invitation acceptance (optional Bearer when already signed in). */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token) {
    return NextResponse.json(
      { message: "Invite token is required." },
      { status: 400 },
    );
  }

  const authHeader = request.headers.get("Authorization");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authHeader?.trim()) {
    headers.Authorization = authHeader.trim();
  }

  try {
    const response = await axios.post(
      adminApiUrl(envConfig.BASEURL, "teams/invitations/accept"),
      body,
      {
        headers,
        validateStatus: () => true,
        timeout: 30_000,
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the server." },
      { status: 502 },
    );
  }
}

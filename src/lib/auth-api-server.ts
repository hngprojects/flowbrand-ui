import axios from "axios";
import { cookies } from "next/headers";
import { authApiUrl } from "@/lib/auth-api";

/** Server-only: refresh access token using HttpOnly cookies from the request. */
export async function refreshAccessToken(baseUrl: string): Promise<{
  access_token: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((entry) => `${entry.name}=${entry.value}`)
      .join("; ");

    const response = await axios.post(
      authApiUrl(baseUrl, "/refresh-token"),
      {},
      {
        withCredentials: true,
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      },
    );

    const body =
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
        ? (response.data.data as Record<string, unknown>)
        : null;

    const accessToken =
      typeof body?.accessToken === "string"
        ? body.accessToken
        : typeof body?.access_token === "string"
          ? body.access_token
          : null;

    if (!accessToken) {
      return null;
    }

    return {
      access_token: accessToken,
    };
  } catch {
    return null;
  }
}

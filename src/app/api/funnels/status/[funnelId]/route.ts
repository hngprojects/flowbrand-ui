import { NextResponse } from "next/server";
import axios from "axios";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";

export async function GET(
  request: Request,
  context: { params: { funnelId: string } },
) {
  try {
    const session = await auth();
    const accessToken = session?.access_token;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(
      `${envConfig.BASEURL}/api/funnels/generate/status/${context.params.funnelId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch funnel status" },
      { status: 500 },
    );
  }
}

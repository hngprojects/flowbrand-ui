import { NextResponse } from "next/server";
import axios from "axios";
import { auth } from "@/auth";
import { envConfig } from "@/config/env.config";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const accessToken = session?.access_token;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const response = await axios.post(
      `${envConfig.BASEURL}/api/funnels/generate`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json(
      { message: "Failed to generate funnel" },
      { status: 500 },
    );
  }
}

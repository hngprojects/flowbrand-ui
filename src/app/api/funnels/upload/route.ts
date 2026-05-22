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

    const formData = await request.formData();

    const response = await axios.post(
      `${envConfig.BASEURL}/api/funnels/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

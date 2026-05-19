import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, message: "API URL not configured" },
        { status: 500 },
      );
    }

    const backendRes = await fetch(`${apiUrl}/api/waitlist/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      const message =
        (Array.isArray(data?.details) && data.details[0]) ||
        data?.message ||
        "Failed to join waitlist";
      return NextResponse.json(
        { success: false, message },
        { status: backendRes.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        isNew: backendRes.status === 201,
        message: data?.message ?? "You are on the waitlist",
        data: data?.data,
      },
      { status: backendRes.status },
    );
  } catch (error) {
    console.error("Waitlist proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Network or server error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    // simulate sending to backend or email service
    console.log("Waitlist email received:", email);

    return NextResponse.json(
      { message: "Successfully joined waitlist" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

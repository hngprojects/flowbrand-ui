type WaitlistResult =
  | { success: true; isNew: boolean; message: string }
  | { success: false; message: string };

export async function joinWaitlist(email: string): Promise<WaitlistResult> {
  try {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message ?? "Request failed",
      };
    }

    return {
      success: true,
      isNew: data?.isNew ?? true,
      message: data?.message ?? "You are on the waitlist",
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

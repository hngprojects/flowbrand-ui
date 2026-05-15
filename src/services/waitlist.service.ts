export async function joinWaitlist(email: string) {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const contentType = res.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(
      typeof data === "string" ? data : data?.message || "Request failed",
    );
  }

  return data;
}

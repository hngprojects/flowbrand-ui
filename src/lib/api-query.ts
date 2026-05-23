/** Unwrap server action results for TanStack Query (throws on failure). */
export function unwrapActionResult<T>(
  result: { ok: true; data: T } | { ok: false; error: string },
  fallback = "Request failed.",
): T {
  if (!result.ok) {
    throw new Error(result.error || fallback);
  }
  return result.data;
}

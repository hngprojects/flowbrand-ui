import { adminGatewayFetch } from "@/lib/admin-api-client";
import type { AdminSearchUser } from "@/types/admin";

type SearchResult = {
  type: string;
  id: string;
  display_name: string;
  email: string;
};

type SearchResponse = {
  results?: SearchResult[];
  data?: { results?: SearchResult[] };
};

function mapSearchResult(result: SearchResult): AdminSearchUser {
  return {
    id: result.id,
    fullName: result.display_name,
    email: result.email,
  };
}

/** GET /api/admin/search?q= — global user search (min 2 characters). */
export async function searchAdminApi(
  query: string,
): Promise<AdminSearchUser[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const res = await adminGatewayFetch(
    `search?q=${encodeURIComponent(trimmed)}`,
  );

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Search failed (${res.status})`);
  }

  const body = (await res.json()) as SearchResponse;
  const results =
    body.results ??
    (body.data && "results" in body.data ? body.data.results : undefined) ??
    [];

  return results.filter((item) => item.type === "user").map(mapSearchResult);
}

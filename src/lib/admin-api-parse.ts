export async function parseAdminError(res: Response): Promise<never> {
  const body = (await res.json().catch(() => ({}))) as { message?: string };
  throw new Error(body.message ?? `Request failed (${res.status})`);
}

export function unwrapAdminData<T>(body: unknown): T {
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export async function parseAdminJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    await parseAdminError(res);
  }
  const body = await res.json();
  return unwrapAdminData<T>(body);
}

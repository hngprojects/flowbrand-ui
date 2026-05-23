export function withGoogleSignInSuccessQuery(path: string): string {
  const qIndex = path.indexOf("?");
  const pathname = qIndex === -1 ? path : path.slice(0, qIndex);
  const params = new URLSearchParams(
    qIndex === -1 ? "" : path.slice(qIndex + 1),
  );
  params.set("google_success", "1");
  const query = params.toString();
  return query ? `${pathname}?${query}` : `${pathname}?google_success=1`;
}

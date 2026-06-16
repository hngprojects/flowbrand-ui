/** Normalize API avatar values (relative key or absolute URL). */
export function normalizeAvatarStorageUrl(
  raw: string | null | undefined,
  apiBaseUrl: string,
): string | null {
  if (!raw?.trim()) return null;
  const value = raw.trim();
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  try {
    const apiOrigin = new URL(apiBaseUrl).origin;
    const path = value.replace(/^\/+/, "");
    if (path.startsWith("flowbrand")) {
      return `${apiOrigin}/${path}`;
    }
    return `${apiOrigin}/flowbrand-staging-uploads/${path}`;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Could not resolve avatar URL from apiBaseUrl:", err);
    }
    return value;
  }
}

/** Display URL from the API, with optional cache-busting after upload. */
export function resolveProfileAvatarDisplayUrl(
  avatarUrl: string | null | undefined,
  cacheKey?: string | null,
): string | null {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith("blob:") || avatarUrl.startsWith("data:")) {
    return avatarUrl;
  }
  if (!cacheKey) return avatarUrl;

  try {
    const url = new URL(avatarUrl);
    url.searchParams.set("v", cacheKey);
    return url.toString();
  } catch {
    const separator = avatarUrl.includes("?") ? "&" : "?";
    return `${avatarUrl}${separator}v=${encodeURIComponent(cacheKey)}`;
  }
}

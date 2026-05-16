const REQUIRED_ENV_KEYS = ["BASE_URL", "APP_URL"] as const;
const PRODUCTION_ENV_KEYS = ["AUTH_SECRET"] as const;

function getMissingEnvKeys(): string[] {
  const keys =
    process.env.NODE_ENV === "production"
      ? [...REQUIRED_ENV_KEYS, ...PRODUCTION_ENV_KEYS]
      : [...REQUIRED_ENV_KEYS];

  return keys.filter((key) => !process.env[key]?.trim());
}

/** Throws in production when required env vars are missing. */
export function validateEnvConfig(): void {
  const missing = getMissingEnvKeys();
  if (missing.length === 0) return;

  const message = `Missing required environment variables: ${missing.join(", ")}`;

  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }

  console.warn(`[env] ${message}`);
}

export const envConfig = {
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ?? "",
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ?? "",
  BASEURL: process.env.BASE_URL ?? "",
  APP_URL: process.env.APP_URL ?? "",
} as const;

validateEnvConfig();

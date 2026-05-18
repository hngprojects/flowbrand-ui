const REQUIRED_ENV_KEYS = ["BASE_URL", "APP_URL"] as const;

const OPTIONAL_ENV_KEYS = ["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET"] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

function readEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

function getAuthSecret(): string | undefined {
  return readEnv("AUTH_SECRET") ?? readEnv("NEXTAUTH_SECRET");
}

function getMissingEnvKeys(): string[] {
  const missing: string[] = REQUIRED_ENV_KEYS.filter((key) => !readEnv(key));

  if (process.env.NODE_ENV === "production" && !getAuthSecret()) {
    missing.push("AUTH_SECRET or NEXTAUTH_SECRET");
  }

  return missing;
}

function requireEnv(key: RequiredEnvKey): string {
  const value = readEnv(key);
  if (value) return value;

  throw new Error(
    `Missing required environment variable: ${key}. ` +
      "Copy .env.example to .env.local and set this value.",
  );
}

/** Validates required env vars at module load. Throws with a clear message when any are missing. */
export function validateEnvConfig(): void {
  const missing = getMissingEnvKeys();
  if (missing.length === 0) return;

  const message =
    `Missing required environment variables: ${missing.join(", ")}. ` +
    "Copy .env.example to .env.local and configure them before starting the app.";

  throw new Error(message);
}

validateEnvConfig();

export const envConfig = {
  AUTH_GOOGLE_ID: readEnv("AUTH_GOOGLE_ID") ?? "",
  AUTH_GOOGLE_SECRET: readEnv("AUTH_GOOGLE_SECRET") ?? "",
  BASEURL: requireEnv("BASE_URL"),
  APP_URL: requireEnv("APP_URL"),
} as const satisfies Record<
  "AUTH_GOOGLE_ID" | "AUTH_GOOGLE_SECRET" | "BASEURL" | "APP_URL",
  string
>;

export type EnvConfig = typeof envConfig;

/** Optional keys (Google OAuth) — empty string when unset. */
export const optionalEnvKeys = OPTIONAL_ENV_KEYS;

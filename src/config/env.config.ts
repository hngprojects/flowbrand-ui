export const envConfig = {
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID as string,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET as string,
  BASEURL: process.env.BASE_URL as string,
  APP_URL: process.env.APP_URL as string,
} as const;

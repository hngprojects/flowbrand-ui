export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export const authRoutes = [
  "/login",
  "/register",
  "/register/verify",
  "/forgot-password",
  "/reset-password",
] as const;

export const protectedRoutes = ["/dashboard"] as const;

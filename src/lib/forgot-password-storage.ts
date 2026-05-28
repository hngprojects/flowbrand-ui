/** sessionStorage keys for the forgot/reset-password flow (kept out of the URL). */
export const FORGOT_RESET_EMAIL_KEY = "flowbrand_forgot_reset_email";
export const FORGOT_RESET_TOKEN_KEY = "flowbrand_forgot_reset_token";

export const FORGOT_RESET_STORAGE_CHANGED_EVENT =
  "forgot-reset-storage-changed";

function notifyForgotResetStorageChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FORGOT_RESET_STORAGE_CHANGED_EVENT));
}

/* ---------- email ---------- */

export function setForgotResetEmail(email: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(FORGOT_RESET_EMAIL_KEY, email);
  notifyForgotResetStorageChanged();
}

export function getForgotResetEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(FORGOT_RESET_EMAIL_KEY);
}

/* ---------- reset token (set after OTP verification) ---------- */

export function setForgotResetToken(token: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(FORGOT_RESET_TOKEN_KEY, token);
  notifyForgotResetStorageChanged();
}

export function getForgotResetToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(FORGOT_RESET_TOKEN_KEY);
}

export function clearForgotResetToken() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(FORGOT_RESET_TOKEN_KEY);
  notifyForgotResetStorageChanged();
}

/* ---------- clear everything (call after success or when bailing) ---------- */

export function clearForgotResetStorage() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(FORGOT_RESET_EMAIL_KEY);
  sessionStorage.removeItem(FORGOT_RESET_TOKEN_KEY);
  notifyForgotResetStorageChanged();
}

export function subscribeToForgotResetStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(FORGOT_RESET_STORAGE_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(
      FORGOT_RESET_STORAGE_CHANGED_EVENT,
      onStoreChange,
    );
    window.removeEventListener("storage", onStoreChange);
  };
}

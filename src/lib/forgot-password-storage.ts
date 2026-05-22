/** sessionStorage key for password-reset email (not stored in the URL). */
export const FORGOT_RESET_EMAIL_KEY = "flowbrand_forgot_reset_email";

export const FORGOT_RESET_STORAGE_CHANGED_EVENT =
  "forgot-reset-storage-changed";

function notifyForgotResetStorageChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FORGOT_RESET_STORAGE_CHANGED_EVENT));
}

export function setForgotResetEmail(email: string) {
  sessionStorage.setItem(FORGOT_RESET_EMAIL_KEY, email);
  notifyForgotResetStorageChanged();
}

export function getForgotResetEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(FORGOT_RESET_EMAIL_KEY);
}

export function clearForgotResetStorage() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(FORGOT_RESET_EMAIL_KEY);
  notifyForgotResetStorageChanged();
}

export function subscribeToForgotResetStorage(onStoreChange: () => void) {
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

/** sessionStorage key for post-registration email (avoids putting PII in the URL). */
export const REGISTER_VERIFY_EMAIL_STORAGE_KEY =
  "flowbrand_register_verify_email";

export const REGISTER_VERIFY_EMAIL_CHANGED_EVENT =
  "register-verify-email-changed";

function notifyRegisterVerifyEmailChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REGISTER_VERIFY_EMAIL_CHANGED_EVENT));
}

export function setRegisterVerifyEmail(email: string) {
  sessionStorage.setItem(REGISTER_VERIFY_EMAIL_STORAGE_KEY, email);
  notifyRegisterVerifyEmailChanged();
}

export function clearRegisterVerifyEmail() {
  sessionStorage.removeItem(REGISTER_VERIFY_EMAIL_STORAGE_KEY);
  notifyRegisterVerifyEmailChanged();
}

export function getRegisterVerifyEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REGISTER_VERIFY_EMAIL_STORAGE_KEY);
}

export function subscribeToRegisterVerifyEmail(onStoreChange: () => void) {
  window.addEventListener(REGISTER_VERIFY_EMAIL_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(
      REGISTER_VERIFY_EMAIL_CHANGED_EVENT,
      onStoreChange,
    );
    window.removeEventListener("storage", onStoreChange);
  };
}

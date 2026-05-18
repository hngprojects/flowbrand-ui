/** sessionStorage key for post-registration email (avoids putting PII in the URL). */
export const REGISTER_VERIFY_EMAIL_STORAGE_KEY = "seil_register_verify_email";

const REGISTER_VERIFY_COOLDOWN_KEY = "seil_register_verify_cooldown";

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

export function setRegisterVerifyCooldown(seconds: number) {
  if (typeof window === "undefined") return;
  const value = Math.max(0, Math.ceil(seconds));
  if (value > 0) {
    sessionStorage.setItem(REGISTER_VERIFY_COOLDOWN_KEY, String(value));
  } else {
    sessionStorage.removeItem(REGISTER_VERIFY_COOLDOWN_KEY);
  }
}

/** Read once when the verify page mounts (clears stored value). */
export function consumeRegisterVerifyCooldown(): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(REGISTER_VERIFY_COOLDOWN_KEY);
  sessionStorage.removeItem(REGISTER_VERIFY_COOLDOWN_KEY);
  if (!raw) return 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.ceil(parsed) : 0;
}

export function clearRegisterVerifyCooldown() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REGISTER_VERIFY_COOLDOWN_KEY);
}

export function clearRegisterVerifyEmail() {
  sessionStorage.removeItem(REGISTER_VERIFY_EMAIL_STORAGE_KEY);
  clearRegisterVerifyCooldown();
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

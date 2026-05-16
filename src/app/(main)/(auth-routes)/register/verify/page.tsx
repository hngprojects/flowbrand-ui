"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import OtpVerification from "@/components/features/auth/register/OtpVerification";
import AuthSplitLayout from "@/components/features/auth/auth-split-layout";
import { REGISTER_VERIFY_EMAIL_STORAGE_KEY } from "@/lib/register-verify-storage";

function getVerifyEmailSnapshot(): string | null {
  return sessionStorage.getItem(REGISTER_VERIFY_EMAIL_STORAGE_KEY);
}

function subscribeToVerifyEmail(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export default function RegisterVerifyPage() {
  const router = useRouter();
  const email = useSyncExternalStore(
    subscribeToVerifyEmail,
    getVerifyEmailSnapshot,
    () => null,
  );

  useEffect(() => {
    if (email === null) {
      router.replace("/register");
    }
  }, [email, router]);

  if (email === null) {
    return (
      <AuthSplitLayout>
        <div className="py-12 text-center text-sm text-[#32476D]">Loading…</div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout>
      <OtpVerification email={email} />
    </AuthSplitLayout>
  );
}

"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import OtpVerification from "@/components/features/auth/register/OtpVerification";
import AuthSplitLayout from "@/components/features/auth/auth-split-layout";
import {
  getRegisterVerifyEmail,
  subscribeToRegisterVerifyEmail,
} from "@/lib/register-verify-storage";

export default function RegisterVerifyPage() {
  const router = useRouter();
  const email = useSyncExternalStore(
    subscribeToRegisterVerifyEmail,
    getRegisterVerifyEmail,
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

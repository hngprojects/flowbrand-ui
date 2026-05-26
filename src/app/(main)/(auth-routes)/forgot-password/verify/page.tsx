"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordOtpForm from "@/components/features/auth/forgotPassword/ForgotPasswordOtpForm";
import AuthSplitLayout from "@/components/features/auth/authSplitLayout";
import {
  getForgotResetEmail,
  subscribeToForgotResetStorage,
} from "@/lib/forgot-password-storage";

export default function ForgotPasswordVerifyPage() {
  const router = useRouter();
  const email = useSyncExternalStore(
    subscribeToForgotResetStorage,
    getForgotResetEmail,
    () => null,
  );

  useEffect(() => {
    if (email === null) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  if (!email) {
    return (
      <AuthSplitLayout>
        <div className="py-12 text-center text-sm text-[#32476D]">Loading…</div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout>
      <ForgotPasswordOtpForm email={email} />
    </AuthSplitLayout>
  );
}

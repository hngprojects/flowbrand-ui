"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import AuthSplitLayout from "@/components/features/auth/authSplitLayout";
import { VerifyResetOtpForm } from "@/components/features/auth/resetPassword/verifyResetOtpForm";
import {
  getForgotResetEmail,
  getForgotResetToken,
  subscribeToForgotResetStorage,
} from "@/lib/forgot-password-storage";

export default function VerifyResetOtpPage() {
  const router = useRouter();
  const email = useSyncExternalStore(
    subscribeToForgotResetStorage,
    getForgotResetEmail,
    () => null,
  );
  const resetToken = useSyncExternalStore(
    subscribeToForgotResetStorage,
    getForgotResetToken,
    () => null,
  );

  useEffect(() => {
    if (email === null) {
      router.replace("/forgot-password");
      return;
    }
    if (resetToken) {
      router.replace("/reset-password");
    }
  }, [email, resetToken, router]);

  if (!email || resetToken) {
    return null;
  }

  return (
    <AuthSplitLayout>
      <VerifyResetOtpForm email={email} />
    </AuthSplitLayout>
  );
}

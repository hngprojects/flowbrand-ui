import ResetPasswordPage from "@/components/features/auth/resetPassword/resetPasswordForm";
import AuthSplitLayout from "@/components/features/auth/authSplitLayout";

export default function Page() {
  return (
    <AuthSplitLayout>
      <ResetPasswordPage />
    </AuthSplitLayout>
  );
}

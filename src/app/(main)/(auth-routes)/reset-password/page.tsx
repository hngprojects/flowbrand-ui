import CreateNewPassword from "@/components/features/auth/resetPassword/resetPasswordForm";
import AuthSplitLayout from "@/components/features/auth/authSplitLayout";

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <CreateNewPassword />
    </AuthSplitLayout>
  );
}

import CreateNewPassword from "@/components/features/auth/reset-password/reset-password-form";
import AuthSplitLayout from "@/components/features/auth/auth-split-layout";

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <CreateNewPassword />
    </AuthSplitLayout>
  );
}

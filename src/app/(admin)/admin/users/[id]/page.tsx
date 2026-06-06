import { UserProfile } from "@/components/admin/users/user-profile";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AdminShell>
      <UserProfile userId={id} />
    </AdminShell>
  );
}

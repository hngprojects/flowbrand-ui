import { UserProfile } from "@/components/admin/users/user-profile";

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserProfile userId={id} />;
}

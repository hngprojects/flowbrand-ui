import { UserProfile } from "@/components/admin/users/user-profile";

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-[`#F9FAFB`] px-4 py-8 md:px-8">
      <UserProfile userId={id} />
    </main>
  );
}

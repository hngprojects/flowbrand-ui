import { UserProfile } from "@/components/admin/users/user-profile";

export default function AdminUserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 md:px-8">
      <UserProfile userId={params.id} />
    </main>
  );
}

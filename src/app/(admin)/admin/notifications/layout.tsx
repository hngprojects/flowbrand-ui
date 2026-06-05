import AdminNavbar from "@/components/navigation/admin-navbar/index";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col justify-between">
      <AdminNavbar />
      {children}
    </div>
  );
}

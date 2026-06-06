export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add admin auth guard when backend provides admin role check
  return <>{children}</>;
}

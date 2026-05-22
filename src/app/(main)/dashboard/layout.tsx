import QueryProvider from "@/components/QueryProvider/query-provider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <>{children}</>
    </QueryProvider>
  );
}

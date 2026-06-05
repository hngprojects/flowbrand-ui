import { Suspense } from "react";
import Link from "next/link";
import LogoIcon from "@/components/icons/navbar/logo";
import { AdminLoginForm } from "@/components/admin/auth/admin-login-form";

export const metadata = {
  title: "Admin Portal Login",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <header className="px-6 py-6 md:px-10">
        <Link href="/" className="inline-flex">
          <LogoIcon />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <Suspense
          fallback={<p className="text-sm text-neutral-500">Loading...</p>}
        >
          <AdminLoginForm />
        </Suspense>
      </main>
    </div>
  );
}

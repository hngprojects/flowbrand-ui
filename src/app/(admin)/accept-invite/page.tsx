import { Suspense } from "react";
import Link from "next/link";
import LogoIcon from "@/components/icons/navbar/logo";
import { AcceptInviteView } from "@/components/admin/auth/accept-invite-view";

export const metadata = {
  title: "Accept invitation · Admin",
};

export default function AcceptInvitePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <header className="px-6 py-6 md:px-10">
        <Link href="/" className="inline-flex">
          <LogoIcon />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <Suspense
          fallback={
            <div className="h-40 w-full max-w-[520px] animate-pulse rounded-2xl bg-gray-100" />
          }
        >
          <AcceptInviteView />
        </Suspense>
      </main>
    </div>
  );
}

"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-[#32476D]">Loading…</p>
      </div>
    );
  }

  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  const displayName =
    [session.user.first_name, session.user.last_name]
      .filter(Boolean)
      .join(" ") || session.user.email;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-[#326AD1]">Dashboard</h1>
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            Welcome, {displayName}
          </h2>
          <p className="text-gray-600">
            You are signed in. This page is only available to authenticated
            users.
          </p>
          <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-500">
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
            <p className="mt-1">
              <strong>User ID:</strong> {session.user.id}
            </p>
          </div>
          <p className="mt-6">
            <Link href="/" className="text-[#326AD1] hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

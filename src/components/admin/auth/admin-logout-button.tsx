"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogoutRequest } from "@/lib/admin-api-client";
import { ADMIN_LOGIN_ROUTE } from "@/routes";

type AdminLogoutButtonProps = {
  className?: string;
  label?: string;
};

export function AdminLogoutButton({
  className,
  label = "Log out",
}: AdminLogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await adminLogoutRequest();
      router.replace(ADMIN_LOGIN_ROUTE);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={loading}
      className={className}
    >
      {loading ? "Logging out..." : label}
    </button>
  );
}

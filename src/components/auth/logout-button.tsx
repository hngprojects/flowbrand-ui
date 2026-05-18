"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  variant?: "default" | "menu";
  onAfterLogout?: () => void;
};

const menuVariantClass =
  "hover:bg-muted w-full px-4 py-2 text-left text-sm font-medium " +
  "text-[#D13232] transition-colors disabled:opacity-50";

const defaultVariantClass = cn(
  "hidden h-11 items-center justify-center lg:flex",
  "rounded-[41px] border border-gray-500 px-4",
  "text-foreground text-sm font-medium",
  "hover:border-[#D13232] hover:text-[#D13232]",
  "disabled:opacity-50",
);

export function LogoutButton({
  className,
  variant = "default",
  onAfterLogout,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      onAfterLogout?.();
      sessionStorage.removeItem("flowbrand-funnel-preview-toast");
      // Full redirect so middleware sees a cleared session (client router.push races the cookie).
      await signOut({ callbackUrl: "/login", redirect: true });
    } catch {
      window.location.assign("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        variant === "menu" ? menuVariantClass : defaultVariantClass,
        className,
      )}
    >
      {isLoading ? "Signing out…" : "Log out"}
    </button>
  );
}

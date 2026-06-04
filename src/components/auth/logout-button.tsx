"use client";

import { useState } from "react";
import { performClientLogout } from "@/lib/client-logout";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  variant?: "default" | "menu";
};

const menuVariantClass =
  "hover:bg-muted w-full px-4 py-2 text-left text-sm font-medium " +
  "text-red-500 transition-colors disabled:opacity-50";

const defaultVariantClass = cn(
  "hidden h-11 items-center justify-center lg:flex",
  "rounded-[41px] border border-gray-500 px-4",
  "text-foreground text-sm font-medium",
  "hover:border-red-500 hover:text-red-500",
  "disabled:opacity-50",
);

export function LogoutButton({
  className,
  variant = "default",
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      sessionStorage.removeItem("flowbrand-strategy-preview-toast");
      await performClientLogout({ callbackUrl: "/login", redirect: true });
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
      {isLoading ? "Logging out..." : "Log out"}
    </button>
  );
}

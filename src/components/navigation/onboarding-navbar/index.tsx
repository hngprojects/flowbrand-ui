"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LogoIcon from "@/components/icons/navbar/logo";
import BellIcon from "@/components/icons/navbar/bell";
import ProfileIcon from "@/components/icons/navbar/profile";
import { LogoutButton } from "@/components/auth/logout-button";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "How it works", path: "/how-it-works" },
  { label: "About Us", path: "/about-us" },
  { label: "Pricing", path: "/pricing" },
];

const OnboardingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!profileOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [profileOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="layout-components-class flex h-[83px] items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="z-50 flex h-11 w-11 items-center justify-center rounded-[41px] border-[0.5px] border-gray-500 p-[10px] lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X size={24} className="text-foreground" />
              ) : (
                <Menu size={24} className="text-foreground" />
              )}
            </button>

            <Link href="/" className="cursor-pointer">
              <LogoIcon />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LogoutButton className="hidden lg:flex" />
            <button
              type="button"
              aria-label="Notifications"
              className="border-gray-500 flex h-11 w-11 items-center justify-center rounded-[41px] border-[0.5px] p-[10px]"
            >
              <BellIcon />
            </button>
            <div ref={profileRef} className="relative">
              <button
                type="button"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
                className="border-gray-500 flex h-11 items-center gap-[10px] rounded-[41px] border-[0.5px] px-3 py-[10px] lg:w-[103px]"
              >
                <ProfileIcon />
                <span className="text-foreground hidden text-sm font-medium lg:inline">
                  Profile
                </span>
              </button>
              {profileOpen ? (
                <div className="border-border absolute top-[calc(100%+8px)] right-0 z-50 min-w-[160px] overflow-hidden rounded-xl border bg-white py-1 shadow-lg">
                  <LogoutButton variant="menu" className="flex" />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div
          className={`bg-background absolute top-full left-0 flex w-full flex-col gap-4 overflow-hidden text-sm font-semibold transition-all duration-300 ease-in-out lg:hidden ${
            isOpen
              ? "max-h-96 py-6 opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          }`}
          inert={!isOpen ? true : undefined}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className={`hover:text-primary px-4 py-2 text-black-300 ${
                pathname === link.path ? "text-primary" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-4">
            <LogoutButton
              variant="menu"
              className="flex w-full rounded-lg border border-border"
            />
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed top-0 right-0 left-0 z-40 h-screen w-screen bg-black/50 lg:hidden"
        />
      )}
    </>
  );
};

export default OnboardingNavbar;

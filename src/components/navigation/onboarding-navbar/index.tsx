"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LogoIcon from "@/components/icons/navbar/logo";
import BellIcon from "@/components/icons/navbar/bell";
import ProfileIcon from "@/components/icons/navbar/profile";
import { useState } from "react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "How it works", path: "/how-it-works" },
  { label: "About Us", path: "/about-us" },
  { label: "Pricing", path: "/pricing" },
];

const OnboardingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-background border-border sticky top-0 z-50 border-b">
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
            <div className="border-gray-500 flex h-11 w-11 items-center justify-center rounded-[41px] border-[0.5px] p-[10px]">
              <BellIcon />
            </div>
            <div className="border-gray-500 flex h-11 items-center gap-[10px] rounded-[41px] border-[0.5px] px-3 py-[10px] lg:w-[103px]">
              <ProfileIcon />
              <span className="text-foreground hidden text-sm font-medium lg:block">
                Profile
              </span>
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

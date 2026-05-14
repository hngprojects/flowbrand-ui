"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LogoIcon from "@/components/icons/navbar/logo";
import { useState } from "react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "How it works", path: "/how-it-works" },
  { label: "About Us", path: "/about-us" },
  { label: "Pricing", path: "/pricing" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-background border-border font-inter sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-[83px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-18">
          <Link href="/" className="cursor-pointer">
            <LogoIcon />
          </Link>

          <ul className="hidden items-center lg:flex lg:gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.path}
                  className={`hover:text-primary flex h-12 items-center justify-center py-3 text-base font-medium text-black-300 transition-colors ${
                    pathname === link.path ||
                    (link.path !== "/" && pathname.startsWith(link.path))
                      ? "text-primary font-semibold"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/login"
              className="text-foreground hover:text-primary flex h-[51px] items-center justify-center px-6 py-3 text-base font-medium transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/get-started"
              className="bg-primary text-primary-foreground flex h-[51px] items-center justify-center rounded-[10px] px-6 py-3 font-semibold transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </div>

          <button
            className="z-50 lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X size={24} className="text-foreground" />
            ) : (
              <Menu size={24} className="text-foreground" />
            )}
          </button>
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

          <div className="flex flex-col gap-3 px-4 pt-2">
            <Link
              href="/login"
              className="border-primary text-primary rounded-lg border py-2.5 text-center font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Log In
            </Link>
            <Link
              href="/get-started"
              className="bg-primary text-primary-foreground rounded-[10px] py-2.5 text-center font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Get started
            </Link>
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

export default Navbar;

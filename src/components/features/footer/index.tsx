import { FullLightLogo, FullTranparentLogo } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";

const productLinks = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
];

const legalLinks = [
  { label: "Terms of use", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-foreground">
      <div className="section-class">
        <div className="flex flex-col gap-[var(--spacing-small)] lg:flex-row lg:justify-between">
          {/* LEFT */}
          <div className="max-w-[360px]">
            <div className="mb-[var(--spacing-small)]">
              <FullLightLogo />
            </div>

            <p className="text-sm leading-6 text-gray-500">
              Build smarter marketing strategy without the guesswork and helping
              small and growing businesses turn attention into real customers.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex gap-[var(--spacing-default)] sm:gap-[64px]">
            {/* PRODUCT */}
            <div className="space-y-[var(--spacing-small)]">
              <h3 className="text-base font-semibold text-primary-foreground">
                Product
              </h3>

              <ul>
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEGAL */}
            <div className="space-y-[var(--spacing-small)]">
              <h3 className="text-base font-semibold text-primary-foreground">
                Legal
              </h3>

              <ul>
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-[var(--spacing-default)] h-px w-full bg-gray-500/20" />

        {/* WATERMARK LOGO */}
        <div className="lg:w-full flex items-center justify-center w-[calc(var(--spacing-hero)*4)] md:w-[calc(var(--spacing-hero)*3)] h-auto mx-auto">
          <FullTranparentLogo />
        </div>
      </div>
    </footer>
  );
}

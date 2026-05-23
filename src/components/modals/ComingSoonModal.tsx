"use client";

import Link from "next/link";

interface ComingSoonModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/use.seil",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },

  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/useseil/",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/useseil",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

function ClockIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle
        cx="60"
        cy="60"
        r="54"
        fill="var(--background)"
        stroke="var(--primary-500)"
        strokeWidth="3"
      />
      <circle
        cx="60"
        cy="60"
        r="48"
        stroke="var(--primary-500)"
        strokeOpacity="0.11"
        strokeWidth="1"
      />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const major = i % 3 === 0;
        const inner = major ? 38 : 42;
        return (
          <line
            key={i}
            x1={60 + Math.cos(angle) * inner}
            y1={60 + Math.sin(angle) * inner}
            x2={60 + Math.cos(angle) * 48}
            y2={60 + Math.sin(angle) * 48}
            stroke="var(--primary-500)"
            strokeOpacity={major ? 1 : 0.32}
            strokeWidth={major ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}
      <line
        x1="60"
        y1="60"
        x2="38"
        y2="34"
        stroke="var(--black-600)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="60"
        y1="60"
        x2="82"
        y2="30"
        stroke="var(--black-600)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="60"
        y1="60"
        x2="60"
        y2="16"
        stroke="var(--primary-500)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="60" cy="60" r="4.5" fill="var(--primary-500)" />
      <circle cx="60" cy="60" r="2" fill="var(--background)" />
    </svg>
  );
}

export default function ComingSoonModal({
  isOpen = true,
  onClose,
}: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-600/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-background border border-primary-500/20 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-primary-500" />

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 flex items-center justify-center w-7 h-7 rounded-full text-black-600/30 hover:bg-primary-500/10 transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        <div className="flex flex-col items-center px-8 pt-8 pb-8 gap-5">
          {/* Clock */}
          <div className="drop-shadow-md">
            <ClockIllustration />
          </div>

          {/* Text */}
          <div className="text-center flex flex-col gap-1.5">
            <p className="text-[10px] tracking-[0.28em] uppercase font-semibold text-primary-500 m-0">
              We're working on something
            </p>
            <h2
              className="text-[28px] font-bold text-foreground m-0 leading-tight"
              style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
            >
              Coming Soon
            </h2>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-2.5">
            <div className="flex-1 h-px bg-primary-500/15" />
            <div className="w-1 h-1 rounded-sm bg-primary-500/30 rotate-45" />
            <div className="flex-1 h-px bg-primary-500/15" />
          </div>

          {/* Socials */}
          <div className="flex flex-col items-center gap-2.5">
            <p className="text-[11px] text-black-600/35 tracking-wide m-0">
              Follow us for updates
            </p>
            <div className="flex gap-2.5">
              {socials.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-500 flex items-center justify-center hover:bg-primary-500/15 hover:border-primary-500/40"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-primary-500/15" />
      </div>
    </div>
  );
}

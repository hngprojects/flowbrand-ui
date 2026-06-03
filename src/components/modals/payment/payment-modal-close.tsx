"use client";

export function PaymentModalClose({
  onClose,
  label = "Close",
  ariaLabel,
}: {
  onClose: () => void;
  label?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={ariaLabel ?? label}
      className="pointer-events-auto flex cursor-pointer items-center
       gap-[7.08px] rounded-[25.47px] border-[0.35px] border-gray-500 
       px-[15px] py-[7.08px] text-sm text-black-500 transition-colors hover:bg-gray-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 7L13 13M13 7L7 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-base">{label}</span>
    </button>
  );
}

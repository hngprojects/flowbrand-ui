import { BlueBlackLogo } from "@/components/icons/blueblackLogo";
import LoaderSpinner from "@/components/icons/loader/spinner";
import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  hint?: string;
  className?: string;
}

const Loader = ({ text, hint, className }: LoaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative size-[130px] shrink-0 overflow-hidden">
        <svg
          viewBox="0 0 130 130"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <circle
            cx="65"
            cy="65"
            r="55"
            fill="none"
            stroke="text-gray-400"
            strokeWidth="8"
          />
        </svg>

        <LoaderSpinner />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <BlueBlackLogo className="h-9 w-auto" aria-hidden />
        </div>
      </div>

      {text || hint ? (
        <div className="max-w-md space-y-2 text-center">
          {text ? (
            <p className="text-black-300 text-base font-normal leading-[150%]">
              {text}
            </p>
          ) : null}
          {hint ? (
            <p className="text-sm font-normal leading-[150%] text-neutral-500">
              {hint}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Loader;

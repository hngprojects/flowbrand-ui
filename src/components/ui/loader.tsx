import { BlueBlackLogo } from "@/components/icons/blueblackLogo";
import LoaderSpinner from "@/components/icons/loader/spinner";
import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  className?: string;
}

const Loader = ({ text, className }: LoaderProps) => {
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
            stroke="#E9E9E9"
            strokeWidth="8"
          />
        </svg>

        <LoaderSpinner />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <BlueBlackLogo className="h-9 w-auto" aria-hidden />
        </div>
      </div>

      {text ? (
        <p className="text-black-300 text-center text-base font-normal leading-[150%]">
          {text}
        </p>
      ) : null}
    </div>
  );
};

export default Loader;

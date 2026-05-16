import React from "react";
import MobileLogoIcon from "@/components/icons/navbar/mobile-logo";
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
    >
      <div
        className="relative overflow-visible"
        style={{ width: "130px", height: "130px" }}
      >
        <svg viewBox="0 0 130 130" className="absolute inset-0 h-full w-full">
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

        <div className="absolute inset-0 flex items-center justify-center">
          <MobileLogoIcon />
        </div>
      </div>

      {text && (
        <p className="text-black-300 text-center text-base font-normal leading-[150%] tracking-normal">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;

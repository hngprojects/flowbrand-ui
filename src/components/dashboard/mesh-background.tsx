import { PatternMesh } from "@/components/icons/patternSvg";
import { cn } from "@/lib/utils";

type MeshBackgroundProps = {
  className?: string;
  /** Full viewport width (onboarding). Default false = fills parent only (strategy main panel). */
  fullViewport?: boolean;
};

export function MeshBackground({
  className,
  fullViewport = false,
}: MeshBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        fullViewport && "fixed left-0 right-0 top-0 bottom-0 z-0 w-full",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FCFCFD] to-[#F3F4F6]" />
      <PatternMesh className="absolute inset-0 h-full w-full text-light opacity-80" />
    </div>
  );
}

/** Mesh only on the strategy main content column (spinner / tasks), not sidebar or navbar. */
export function StrategyMainPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gray-25",
        className,
      )}
    >
      <MeshBackground />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}

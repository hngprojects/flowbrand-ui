import WaitlistBody from "@/components/features/waitlist";
import { PatternMesh } from "@/components/icons/patternSvg";

export default function WaitlistView() {
  return (
    <div className="relative bg-gradient-to-r from-primary-100/20 via-primary-100/40 to-primary-100/60 min-h-screen">
      <PatternMesh className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover text-brand-tint  opacity-40" />
      <WaitlistBody />
    </div>
  );
}

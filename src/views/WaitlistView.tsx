import WaitlistBody from "@/components/features/waitlist";
import { PatternWaitlist, WaitlistBottom } from "@/components/icons";

export default function WaitlistView() {
  return (
    <div className="relative bg-gradient-to-r from-primary-100/20 via-primary-100/40 to-primary-100/60">
      <PatternWaitlist className="absolute inset-0 h-full w-full object-cover opacity-40 pointer-events-none -z-10" />
      <WaitlistBody />
      <WaitlistBottom className="mx-auto w-full" />
    </div>
  );
}

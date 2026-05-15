import WaitlistBody from "@/components/features/waitlist";
import {} from "@/components/icons";
import { PatternWaitlist } from "@/components/icons/pattern-svg";
import {
  WaitlistBottom,
  WaitlistBottomSmall,
} from "@/components/icons/waitlist-bottom";

export default function WaitlistView() {
  return (
    <div className="relative bg-gradient-to-r from-primary-100/20 via-primary-100/40 to-primary-100/60">
      <PatternWaitlist className="absolute inset-0 h-full w-full object-cover opacity-40 pointer-events-none -z-10" />
      <WaitlistBody />
      <div className="overflow-hidden w-full">
        <WaitlistBottom className="lg:block md:block hidden" />
        <WaitlistBottomSmall className="lg:hidden md:hidden flex" />
      </div>
    </div>
  );
}

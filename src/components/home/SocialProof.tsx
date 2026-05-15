import Image from "next/image";
import {
  Homemade_Apple,
  Inspiration,
  Inknut_Antiqua,
  Instrument_Serif,
} from "next/font/google";
import { cn } from "@/utils";

const fontHomemadeApple = Homemade_Apple({ weight: "400", subsets: ["latin"] });
const fontInspiration = Inspiration({ weight: "400", subsets: ["latin"] });
const fontInknutAntiqua = Inknut_Antiqua({ weight: "400", subsets: ["latin"] });
const fontInstrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

const logos = [
  {
    label: "Agency",
    icon: "/images/agency.svg",
    fontClass: fontInstrumentSerif.className,
  },
  {
    label: "Beauty Salon",
    icon: "/images/salon.svg",
    fontClass: fontHomemadeApple.className,
  },
  {
    label: "Bakery",
    icon: "/images/bakery.svg",
    fontClass: fontInspiration.className,
  },
  {
    label: "Small Retail",
    icon: "/images/shop.svg",
    fontClass: fontInknutAntiqua.className,
  },
  { label: "Repair Service", icon: "/images/repair.svg", fontClass: undefined },
] as const;

function LogoItem({
  label,
  icon,
  fontClass,
}: {
  label: string;
  icon: string;
  fontClass?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 opacity-50 grayscale transition-opacity hover:opacity-100">
      <Image
        src={icon}
        alt={label}
        width={48}
        height={48}
        className="h-auto w-10 sm:w-12"
      />
      <span
        className={cn(
          "whitespace-nowrap text-center text-[18px] leading-none font-normal text-gray-500 sm:text-[22px]",
          fontClass,
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default function SocialProof() {
  const topRow = logos.slice(0, 3);
  const bottomRow = logos.slice(3);

  return (
    <section className="w-full bg-[#FCFDFF] py-10 md:py-14">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-6">
        <p className="text-center text-[14px] text-gray-600 md:text-[16px]">
          Used by small businesses like yours to build and grow with confidence
        </p>

        {/* ── Desktop: all 5 in one row ── */}
        <div className="hidden w-full max-w-[1200px] md:flex md:items-center md:justify-between">
          {logos.map(({ label, icon, fontClass }) => (
            <LogoItem
              key={label}
              label={label}
              icon={icon}
              fontClass={fontClass}
            />
          ))}
        </div>

        {/* ── Mobile: top 3 in a row, bottom 2 centered ── */}
        <div className="flex w-full flex-col items-center gap-10 md:hidden">
          <div className="flex w-full items-center justify-between">
            {topRow.map(({ label, icon, fontClass }) => (
              <LogoItem
                key={label}
                label={label}
                icon={icon}
                fontClass={fontClass}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-x-32">
            {bottomRow.map(({ label, icon, fontClass }) => (
              <LogoItem
                key={label}
                label={label}
                icon={icon}
                fontClass={fontClass}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

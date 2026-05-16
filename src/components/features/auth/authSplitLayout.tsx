import type { ReactNode } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import LogoIcon from "@/components/icons/navbar/logo";

const AuthSplitLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="bg-background flex min-h-screen w-full">
      <div className="bg-primary/10 hidden w-1/2 max-w-none flex-col justify-between p-6 pr-8 pl-10 lg:flex xl:p-8 xl:pl-14 2xl:p-10 2xl:pl-16">
        <div className="flex shrink-0 items-center">
          <Link href="/" aria-label="Seil home">
            <LogoIcon />
          </Link>
        </div>

        <div className="max-w-lg">
          <h1 className="mb-4 text-2xl leading-tight font-bold text-[#152D58] md:text-[48px]">
            Marketing strategies, made human.
          </h1>
          <p className="text-foreground/70 mb-6 text-sm leading-relaxed xl:mb-8 xl:text-base">
            A solution designed to accelerate your business growth efficiently,
            meeting your needs without the necessity of a marketing degree.
          </p>

          <ul className="space-y-3 text-sm xl:space-y-4 xl:text-base">
            {[
              "Step-by-step simple guided setup.",
              "Tailored solutions for your business needs.",
              "Built for non-marketers.",
            ].map((text) => (
              <li
                key={text}
                className="text-foreground flex items-start gap-2.5 font-normal xl:gap-3"
              >
                <CheckCircle className="text-primary mt-0.5 h-4 w-4 shrink-0 xl:h-5 xl:w-5" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div />
      </div>

      <div className="flex h-screen max-h-screen w-full flex-1 flex-col overflow-y-auto px-4 py-6 lg:items-center lg:justify-center lg:px-0 lg:py-0">
        <div className="flex w-full shrink-0 pb-6 lg:hidden">
          <Link href="/" aria-label="Seil home">
            <LogoIcon />
          </Link>
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center lg:flex-none">
          <div className="h-full w-full max-w-xl md:w-[90%]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;

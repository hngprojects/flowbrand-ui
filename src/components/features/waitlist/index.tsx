import { Button } from "@/components/ui/button";
import WaitlistHeader from "./nav";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function WaitlistBody() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-18 min-h-screen">
      <WaitlistHeader />

      <div className="flex justify-between items-center mx-auto pt-4">
        <div className="max-w-[480px]">
          <div className="flex items-center gap-2 bg-primary-foreground rounded-full px-3 py-1.5 w-fit">
            <div className="bg-primary w-2 h-2 rounded-full"></div>
            <p className="text-primary text-xs font-semibold tracking-wide">
              AVAILABLE SOON
            </p>
          </div>
          <div>
            <h1 className="text-5xl font-base leading-tight mt-6 mb-4 text-foreground">
              Turn More Leads Into Paying{" "}
              <span className="text-primary">Customers</span>
            </h1>
            <p className="text-muted-foreground text-base mb-8">
              Seil helps small and growing businesses attract leads, convert
              customers, and drive repeat sales through guided, step-by-step
              marketing strategy you can execute yourself.
            </p>
          </div>

          <form className="flex w-full max-w-[480px] gap-2">
            <Input
              type="email"
              placeholder="you@gmail.com"
              className="flex-1 h-12 px-4 rounded-xl bg-background border border-gray-800"
            />
            <Button type="submit" className="h-12 px-6 rounded-xl">
              Join Waitlist
            </Button>
          </form>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-background flex items-center justify-center text-xs font-medium text-primary-foreground">
                GD
              </div>
              <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-background flex items-center justify-center text-xs font-medium">
                TY
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-background flex items-center justify-center text-xs font-medium">
                MU
              </div>
              <div className="w-8 h-8 rounded-full bg-green-700 border-2 border-background flex items-center justify-center text-xs font-medium">
                MU
              </div>
            </div>
            <p className="text-sm text-foreground">
              20+ businesses already waiting
            </p>
          </div>
        </div>
        <div>
          <Image
            src="/images/laptop-screen.png"
            width={600}
            height={600}
            alt="laptop screen"
          />
        </div>
      </div>
    </div>
  );
}

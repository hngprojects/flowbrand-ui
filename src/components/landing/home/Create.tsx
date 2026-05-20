import Link from "next/link";

export default function CreateSection() {
  return (
    <div className="section-class flex flex-col items-center gap-2 pb-12 text-center md:pb-20">
      <h2 className="text-black-500 max-w-xs lg:max-w-3xl text-[32px] lg:text-[48px] font-[500] tracking-tight leading-tight">
        Get a step-by-step marketing strategy in minutes
      </h2>
      <p className="text-black-400 max-w-sm lg:max-w-lg text-[16px] leading-relaxed">
        A simple marketing plan that attracts, nurtures, and converts customers
        without stress
      </p>
      <Link
        href="/register"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-lg px-8 py-3.5 text-[16px] md:text-[20px] font-[500] shadow-md transition-all active:scale-95"
      >
        Create a free account
      </Link>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import NotFoundIcon from "@/components/icons/not-found/not-found";

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4"
      style={{ backgroundColor: "#EBF0FA" }}
    >
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2">
        <Image
          src="/images/cloud1.svg"
          alt=""
          width={600}
          height={500}
          className="opacity-90"
        />
      </div>

      <div className="pointer-events-none absolute right-0 bottom-1/4 translate-y-1/2">
        <Image
          src="/images/cloud2.svg"
          alt=""
          width={400}
          height={350}
          className="opacity-90"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <NotFoundIcon />

        <div className="flex flex-col gap-3">
          <h1 className="text-black-500 text-3xl font-bold md:text-4xl">
            Well, this is Awkward!
          </h1>
          <p className="text-black-300 max-w-sm text-sm leading-relaxed md:text-base">
            This page seems to have wondered off. Here is where you can go
            instead
          </p>
        </div>

        <Link
          href="/"
          className="bg-primary text-primary-foreground rounded-lg px-16 py-3 font-medium transition-opacity hover:opacity-90"
        >
          Go to home
        </Link>
      </div>
    </main>
  );
}

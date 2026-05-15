import Link from "next/link";
import Image from "next/image";
import NotFoundIcon from "@/components/icons/not-found/not-found";

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4"
      style={{ backgroundColor: "#EEF2FB" }}
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/cloud-bg.svg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
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

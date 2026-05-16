import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white">
        <Image className="dark:invert" src="/logo.png" alt="Logo" width={100} height={20} priority />
      </main>
    </div>
  );
}
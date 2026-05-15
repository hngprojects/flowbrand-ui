import { BlueBlackLogo } from "@/components/icons";
import Link from "next/link";

export default function WaitlistHeader() {
  return (
    <div className="flex justify-between items-center mx-auto h-[83px]">
      <Link href="#">
        <BlueBlackLogo />
      </Link>
      <div>
        <Link href="#" className="bg-primary-foreground p-4 rounded-4xl">
          Join Community
        </Link>
      </div>
    </div>
  );
}

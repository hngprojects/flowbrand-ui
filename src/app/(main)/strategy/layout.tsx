import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function StrategyLayout({ children }: Props) {
  return <main className="min-h-screen bg-[#FAFAFA]">{children}</main>;
}

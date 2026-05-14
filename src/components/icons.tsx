import type { LucideProps } from "lucide-react";
import { ChevronRight, MessageSquareMore } from "lucide-react";

/** Chat bubble with “more” dots — avoids huge inline SVG paths (and 200-char truncation issues). */
export const ChatIcon = (props: LucideProps) => (
  <MessageSquareMore size={24} aria-hidden {...props} />
);

export const ChevronRightIcon = (props: LucideProps) => (
  <ChevronRight size={18} strokeWidth={2} aria-hidden {...props} />
);

// ---------Example usage:---------
// import { ChatIcon, ChevronRightIcon } from "@/components/icons";

// export default function MyComponent() {
//   return (
//     <div className="flex items-center gap-2 text-primary">
//        <ChatIcon className="w-6 h-6" />
//        <span>Messages</span>
//        <ChevronRightIcon className="w-4 h-4 ml-auto" />
//     </div>
//   );
// }

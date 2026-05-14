import React from "react";

export const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"
      fill="currentColor"
    />
    <path
      d="M12 12C11.44 12 11 11.55 11 11C11 10.45 11.45 10 12 10C12.55 10 13 10.45 13 11C13 11.55 12.56 12 12 12Z"
      fill="currentColor"
    />
    <path
      d="M16 12C15.44 12 15 11.55 15 11C15 10.45 15.45 10 16 10C16.55 10 17 10.45 17 11C17 11.55 16.56 12 16 12Z"
      fill="currentColor"
    />
    <path
      d="M8 12C7.44 12 7 11.55 7 11C7 10.45 7.45 10 8 10C8.55 10 9 10.45 9 11C9 11.55 8.56 12 8 12Z"
      fill="currentColor"
    />
  </svg>
);

export const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M8 6 16 12 8 18 Z" fill="currentColor" />
  </svg>
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

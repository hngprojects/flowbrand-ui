import React from 'react';

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
      d="M12 22.81C11.31 22.81 10.66 22.46 10.2 21.85L8.7 19.85C8.67 19.81 8.55 19.76 8.5 19.75H8C3.83 19.75 1.25 18.62 1.25 13V8C1.25 3.58 3.58 1.25 8 1.25H16C20.42 1.25 22.75 3.58 22.75 8V13C22.75 1
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
    width="9"
    height="18"
    viewBox="0 0 9 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0.7475 17.3375C0.5575 17.3375 0.3675 17.2675 0.2175 17.1175C-0.0725 16.8275 -0.0725 16.3475 0.2175 16.0575L6.7375 9.5375C7.2175 9.0575 7.2175 8.2775 6.7375 7.7975L0.2175 1.2775C-0.0725 0.987
      fill="currentColor"
    />
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

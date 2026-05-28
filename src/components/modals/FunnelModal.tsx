"use client";

import { type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface FunnelModalTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface FunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: FunnelModalTab[];
  defaultTab?: string;
  title?: string;
}

export default function FunnelModal({
  isOpen,
  onClose,
  tabs,
  defaultTab,
  title = "Funnel",
}: FunnelModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="
          fixed
          inset-0
          z-50
          flex
          flex-col
          w-screen
          h-screen
          max-w-none
          bg-white
          border-0
          shadow-2xl
          p-8
          overflow-hidden
          translate-x-0
          translate-y-0
          left-0
          top-0
          md:left-auto
          md:right-5
          md:top-5
          md:bottom-5
          md:w-[50vw]
          md:max-w-[50vw]
          md:h-auto
          md:rounded-[24px]
          md:border
          md:border-gray-500
          min-w-[320px]
          md:min-w-120 
        "
        overlayClassName="bg-black-500/80"
      >
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>

        <Tabs
          key={isOpen ? "open" : "closed"}
          defaultValue={defaultTab ?? tabs[0]?.id}
          className="flex flex-col h-full gap-0"
        >
          <div className="flex items-center justify-between mb-6 shrink-0 border-b-[0.35px] border-gray-500 pb-4 mx-[-32px] px-8">
            <h2 className="text-[18px] font-medium text-foreground">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              className="flex items-center gap-[7.08px] rounded-[25.47px] border-[0.35px] border-gray-500 px-[15px] py-[7.08px] 
              text-sm text-black-500 transition-colors pointer-events-auto hover:bg-gray-50 cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 7L13 13M13 7L7 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-base">Close</span>
            </button>
          </div>

          <TabsList
            className="flex items-center w-full h-[38px] gap-[10px] mb-6 shrink-0 rounded-[12px] border border-gray-400
            px-1 bg-transparent overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="h-full rounded-[10px] font-medium transition-all duration-200 whitespace-nowrap px-4 text-center 
                text-[16px] leading-[150%] text-black-300 data-active:bg-primary-500 data-active:text-white cursor-pointer border-0 
                data-active:shadow-none hover:bg-transparent hover:text-black-300 data-active:hover:bg-primary-500 data-active:hover:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div
            className="flex-1 overflow-y-auto min-h-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

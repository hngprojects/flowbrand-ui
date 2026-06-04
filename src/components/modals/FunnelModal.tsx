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
        variant="sidePanel"
        showCloseButton={false}
        className="min-w-[320px] border-0 bg-white p-8 shadow-2xl md:min-w-120 md:rounded-[24px] md:border md:border-gray-500"
        overlayClassName="bg-black-500/80"
      >
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>

        <Tabs
          key={isOpen ? "open" : "closed"}
          defaultValue={defaultTab ?? tabs[0]?.id}
          className="flex min-w-0 flex-col h-full gap-0"
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

          <div className="mb-6 shrink-0 overflow-x-auto scrollbar-none touch-pan-x [-webkit-overflow-scrolling:touch] max-lg:-mx-8 lg:overflow-x-visible">
            <TabsList
              className="flex h-auto w-max min-w-full flex-nowrap items-center justify-between gap-1.5 rounded-lg border border-gray-400 bg-transparent p-1
               px-8 max-md:rounded-none max-md:border-x-0 md:w-full md:max-w-full md:overflow-x-auto md:rounded-lg md:border md:px-1"
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="after:hidden h-[44px] min-h-[44px] shrink-0 grow-0 basis-auto 
                  rounded-lg border-0 px-3 text-center text-[16px] font-medium leading-[150%]
                   whitespace-nowrap text-black-300 transition-all duration-200 hover:bg-transparent hover:text-black-300
                   data-active:bg-primary-500 data-active:text-white data-active:shadow-none data-active:hover:bg-primary-500 data-active:hover:text-white sm:px-4"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="mt-0 flex h-full min-h-0 flex-col outline-none data-[state=inactive]:hidden"
              >
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

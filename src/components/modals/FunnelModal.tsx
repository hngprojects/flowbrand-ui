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
  variant?: "side" | "center";
}

export default function FunnelModal({
  isOpen,
  onClose,
  tabs,
  defaultTab,
  title = "Funnel",
  variant = "side",
}: FunnelModalProps) {
  const centerClasses = `
    scrollbar-none
    max-h-[92vh]
    w-[calc(100%-1.5rem)]
    overflow-y-auto
    rounded-[24px]
    border
    border-primary-80
    bg-white
    p-5
    sm:max-w-[720px]
    sm:p-7
    md:max-w-[860px]
    md:p-8
    shadow-2xl
  `;

  const sideClasses = `
    fixed
    inset-0
    z-50
    flex
    flex-col
    w-screen
    h-[100dvh]
    max-w-none
    bg-white
    border-0
    shadow-2xl
    p-5
    overflow-hidden
    translate-x-0
    translate-y-0
    left-0
    top-0
    md:inset-auto
    md:left-1/2
    md:top-1/2
    md:-translate-x-1/2
    md:-translate-y-1/2
    md:w-[80vw]
    md:max-w-[600px]
    md:h-[85vh]
    md:rounded-[24px]
    md:border
    md:border-gray-500
    md:p-8
    lg:left-auto
    lg:right-5
    lg:top-5
    lg:bottom-5
    lg:translate-x-0
    lg:translate-y-0
    lg:w-[50vw]
    lg:max-w-[50vw]
    lg:max-h-none
    lg:h-auto
    min-w-[320px]
    md:min-w-120
  `;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={variant === "center" ? centerClasses : sideClasses}
        overlayClassName="bg-black-500/80"
        style={{ height: undefined }}
      >
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>

        <Tabs
          key={isOpen ? "open" : "closed"}
          defaultValue={defaultTab ?? tabs[0]?.id}
          className="flex flex-col h-full gap-0 min-h-0"
        >
          <div className="flex items-center justify-between mb-6 shrink-0 border-b-[0.35px] border-gray-500 pb-4 mx-[-20px] px-5 md:mx-[-32px] md:px-8">
            <h2 className="text-[18px] font-medium text-foreground">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              className="flex items-center gap-[7.08px] rounded-[25.47px] border-[0.35px] border-gray-500 px-[15px] py-[7.08px] 
              text-sm text-black-500 transition-colors pointer-events-auto hover:bg-gray-50 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-base">Close</span>
            </button>
          </div>

          <div
            className="mb-6 shrink-0 w-full"
            style={{ overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <TabsList className="flex items-center h-[42px] w-full gap-[10px] rounded-[12px] border border-gray-400 px-1 bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="h-full shrink-0 min-w-fit rounded-[10px] py-2 px-4 font-medium transition-all duration-200 
                  whitespace-nowrap text-center text-sm leading-[150%] text-black-300 data-active:bg-primary-500 
                  data-active:text-white cursor-pointer border-0 data-active:shadow-none hover:bg-transparent 
                  hover:text-black-300 data-active:hover:bg-primary-500 data-active:hover:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div
            className={`min-h-0 pb-6 ${variant === "center" ? "" : "flex-1 overflow-y-auto"}`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                forceMount
                className="data-[state=inactive]:hidden"
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
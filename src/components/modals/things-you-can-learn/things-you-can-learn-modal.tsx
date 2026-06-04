"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { THINGS_YOU_CAN_LEARN_SECTIONS } from "@/components/modals/things-you-can-learn/things-you-can-learn-content";
import { BusinessDocumentTemplatesFooter } from "@/components/modals/things-you-can-learn/business-document-templates-footer";

type ThingsYouCanLearnModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ThingsYouCanLearnModal({
  isOpen,
  onClose,
}: ThingsYouCanLearnModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        variant="sidePanel"
        showCloseButton={false}
        className="min-w-[320px] border-0 bg-white p-0 shadow-2xl md:min-w-120 md:rounded-[24px] md:border md:border-gray-500"
        overlayClassName="bg-black-500/80"
      >
        <VisuallyHidden>
          <DialogTitle>Things you can learn</DialogTitle>
        </VisuallyHidden>

        <div className="flex shrink-0 items-center justify-between gap-4 border-b-[0.35px] border-gray-500 px-5 py-4 sm:px-6">
          <h2 className="text-base font-medium text-black-500">
            Things you can learn
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="pointer-events-auto flex cursor-pointer items-center gap-[7.08px] rounded-[25.47px]
             border-[0.35px] border-gray-500 px-[15px] py-[7.08px] text-sm text-black-500 transition-colors hover:bg-gray-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
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

        <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-8 pb-4 text-sm leading-relaxed text-black-500">
            {THINGS_YOU_CAN_LEARN_SECTIONS.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h3 className="text-base font-semibold text-black-500">
                  {section.heading}
                </h3>
                {section.paragraphs.map((paragraph) => (
                  <p
                    className="font-[400] text-[16px] text-black-300"
                    key={paragraph}
                  >
                    {paragraph}
                  </p>
                ))}
                {section.quotesIntro ? (
                  <p className="font-[400] text-[16px] text-black-300">
                    {section.quotesIntro}
                  </p>
                ) : null}
                {section.quotes ? (
                  <ul className="space-y-2 pl-1">
                    {section.quotes.map((quote) => (
                      <li
                        key={quote}
                        className="font-[400] text-[16px] text-black-300"
                      >
                        &ldquo;{quote}&rdquo;
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.bullets ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {section.bullets.map((item) => (
                      <li
                        key={item}
                        className="font-[400] text-[16px] text-black-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.closingParagraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-[400] text-[16px] text-black-300"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-neutral-200 bg-white px-5 py-4 sm:px-6 sm:py-5">
          <BusinessDocumentTemplatesFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
}

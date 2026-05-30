"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FunnelListItemDisplay } from "@/lib/funnel-display";

function statusLabel(status: string | undefined): string | null {
  const normalized = status?.toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "generating" || normalized === "pending") {
    return "Generating";
  }
  if (normalized === "failed") return "Failed";
  return null;
}

export function FunnelSwitcher({
  funnels,
  activeFunnelId,
  onSelectFunnel,
  disabled = false,
}: {
  funnels: readonly FunnelListItemDisplay[];
  activeFunnelId: string | null;
  onSelectFunnel: (funnelId: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const active =
    funnels.find((item) => item.funnelId === activeFunnelId) ?? funnels[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (!active) return null;

  const canSwitch = funnels.length > 1 && !disabled;

  return (
    <div ref={rootRef} className="relative">
      <span className="mb-1.5 block text-xs font-medium text-neutral-500">
        Strategy
      </span>
      <button
        type="button"
        disabled={!canSwitch}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={canSwitch ? listboxId : undefined}
        onClick={() => {
          if (canSwitch) setOpen((value) => !value);
        }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[12px] border border-primary-80 bg-white px-3 py-2.5 text-left shadow-[0px_1px_2px_rgba(16,24,40,0.05)]",
          canSwitch && "cursor-pointer hover:bg-neutral-50",
          !canSwitch && "cursor-default",
        )}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-neutral-900">
            {active.label}
          </span>
          {active.subtitle ? (
            <span className="mt-0.5 block truncate text-xs text-neutral-500">
              {active.subtitle}
            </span>
          ) : null}
        </span>
        {canSwitch ? (
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-neutral-500 transition-transform",
              open && "rotate-180",
            )}
          />
        ) : null}
      </button>

      {open && canSwitch ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Select strategy"
          className="scrollbar-none absolute top-[calc(100%+4px)] z-30 max-h-56 w-full overflow-y-auto rounded-[12px] border border-primary-80 bg-white p-1 shadow-lg"
        >
          {funnels.map((item) => {
            const isActive = item.funnelId === activeFunnelId;
            const badge = statusLabel(item.status);

            return (
              <li key={item.funnelId} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectFunnel(item.funnelId);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start justify-between gap-2 rounded-[8px] px-2.5 py-2 text-left transition-colors",
                    isActive ? "bg-primary-50" : "hover:bg-neutral-50",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-neutral-900">
                      {item.label}
                    </span>
                    {item.subtitle ? (
                      <span className="mt-0.5 block truncate text-xs text-neutral-500">
                        {item.subtitle}
                      </span>
                    ) : null}
                    {badge ? (
                      <span className="mt-0.5 block text-[11px] font-medium text-neutral-400">
                        {badge}
                      </span>
                    ) : null}
                  </span>
                  {isActive ? (
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-500"
                      strokeWidth={2.5}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { FunnelListItemDisplay } from "@/lib/funnel-display";
import { renameFunnel, deleteFunnel } from "@/actions/funnel-management";
import { DeleteStrategyModal } from "@/components/modals/DeleteStrategyModal";
import { RenameStrategyModal } from "@/components/modals/RenameStrategyModal";

function statusLabel(status: string | undefined): string | null {
  const normalized = status?.toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "generating" || normalized === "pending")
    return "Generating";
  if (normalized === "failed") return "Failed";
  return null;
}

export function FunnelSwitcher({
  funnels,
  activeFunnelId,
  onSelectFunnel,
  onFunnelRenamed,
  onFunnelDeleted,
  disabled = false,
}: {
  funnels: readonly FunnelListItemDisplay[];
  activeFunnelId: string | null;
  onSelectFunnel: (funnelId: string) => void;
  onFunnelRenamed?: (funnelId: string, newName: string) => void;
  onFunnelDeleted?: (funnelId: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isRenamePending, setIsRenamePending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const active =
    funnels.find((item) => item.funnelId === activeFunnelId) ?? funnels[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setMenuOpenId(null);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const handleRenameStart = (item: FunnelListItemDisplay) => {
    setRenameTarget({ id: item.funnelId, name: item.label });
    setMenuOpenId(null);
  };

  const handleRenameSubmit = async (name: string) => {
    if (!renameTarget) return;
    setIsRenamePending(true);
    const result = await renameFunnel(renameTarget.id, name);
    setIsRenamePending(false);
    if (result.ok) {
      onFunnelRenamed?.(renameTarget.id, name);
      toast.success("Strategy renamed.");
    } else {
      toast.error(result.error ?? "Could not rename strategy.");
    }
    setRenameTarget(null);
  };

  const handleDeleteClick = (funnelId: string) => {
    setDeleteTarget(funnelId);
    setMenuOpenId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeletePending(true);
    const result = await deleteFunnel(deleteTarget);
    setIsDeletePending(false);
    if (result.ok) {
      onFunnelDeleted?.(deleteTarget);
      toast.success("Strategy deleted.");
    } else {
      toast.error(result.error ?? "Could not delete strategy.");
    }
    setDeleteTarget(null);
  };

  if (!active) return null;

  const canSwitch = funnels.length > 1 && !disabled;

  return (
    <div ref={rootRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        disabled={!canSwitch}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={canSwitch ? listboxId : undefined}
        onClick={() => {
          if (canSwitch) {
            setOpen((v) => !v);
            setMenuOpenId(null);
          }
        }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[14px] border border-primary-80 bg-white px-4 py-3.5 text-left shadow-[0px_1px_2px_rgba(16,24,40,0.05)]",
          canSwitch && "cursor-pointer hover:bg-neutral-50",
          !canSwitch && "cursor-default",
        )}
      >
        <span className="block min-w-0 flex-1 truncate text-[15px] font-medium text-neutral-900">
          {active.label}
        </span>
        {canSwitch ? (
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-neutral-500 transition-transform",
              open && "rotate-180",
            )}
          />
        ) : null}
      </button>

      {/* Dropdown */}
      {open && canSwitch ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Select strategy"
          className="scrollbar-none absolute top-[calc(100%+4px)] z-30 max-h-64 w-full overflow-y-auto rounded-[12px] border border-primary-80 bg-white p-1 shadow-lg"
        >
          {funnels.map((item) => {
            const isActive = item.funnelId === activeFunnelId;
            const badge = statusLabel(item.status);
            const isMenuOpen = menuOpenId === item.funnelId;

            return (
              <li key={item.funnelId} role="option" aria-selected={isActive}>
                <div
                  className={cn(
                    "relative flex w-full items-start gap-1 rounded-[8px] px-2.5 py-2 transition-colors",
                    isActive ? "bg-primary-50" : "hover:bg-neutral-50",
                  )}
                >
                  {/* Select button */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectFunnel(item.funnelId);
                      setOpen(false);
                      setMenuOpenId(null);
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
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
                  </button>

                  {/* Right — check + three-dot */}
                  <div className="flex shrink-0 items-center gap-1 pt-0.5">
                    {isActive ? (
                      <Check
                        className="h-3.5 w-3.5 text-primary-500"
                        strokeWidth={2.5}
                      />
                    ) : null}
                    <button
                      type="button"
                      aria-label={`Actions for ${item.label}`}
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                      aria-controls={
                        isMenuOpen
                          ? `funnel-actions-${item.funnelId}`
                          : undefined
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(isMenuOpen ? null : item.funnelId);
                      }}
                      className="rounded-[6px] p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Action popover */}
                  {isMenuOpen ? (
                    <div
                      id={`funnel-actions-${item.funnelId}`}
                      role="menu"
                      className="absolute right-2 top-8 z-40 min-w-[160px] rounded-[10px] border border-neutral-100 bg-white p-1 shadow-lg"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenameStart(item);
                        }}
                        className="flex w-full items-center gap-2 rounded-[7px] px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Rename strategy
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item.funnelId);
                        }}
                        className="flex w-full items-center gap-2 rounded-[7px] px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete strategy
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <RenameStrategyModal
        isOpen={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        onConfirm={(name) => void handleRenameSubmit(name)}
        currentName={renameTarget?.name ?? ""}
        isPending={isRenamePending}
      />

      <DeleteStrategyModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteConfirm()}
        isPending={isDeletePending}
      />
    </div>
  );
}

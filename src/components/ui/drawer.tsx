"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@/components/icons";

export type DrawerSide = "right" | "bottom";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  side?: DrawerSide;
}

/**
 * Painel lateral deslizante.
 * `side="right"` vira bottom-sheet no mobile (mobile first).
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const panelClasses =
    side === "right"
      ? "inset-x-0 bottom-0 max-h-[92dvh] animate-slide-up rounded-t-2xl sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:max-h-none sm:animate-slide-in-right sm:rounded-l-2xl sm:rounded-tr-none sm:w-full sm:max-w-md"
      : "inset-x-0 bottom-0 max-h-[92dvh] animate-slide-up rounded-t-2xl";

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden
        className="absolute inset-0 animate-fade-in bg-primary-950/50"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`absolute flex flex-col border border-border bg-elevated shadow-overlay outline-none ${panelClasses}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4">
          <div>
            {title ? (
              <h2 className="font-display text-base font-semibold text-text">{title}</h2>
            ) : null}
            {description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => onOpenChange(false)}
            className="-m-1 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-background hover:text-text sm:h-8 sm:w-8 sm:m-0"
          >
            <IconX size={16} />
          </button>
        </header>
        {/*
         * Etapa 24: el cuerpo ya se desplaza (min-h-0 + overflow-y-auto);
         * se añade el respiro inferior de safe-area para que el último
         * elemento no quede bajo el indicador de inicio del iPhone.
         */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-4">
          {children}
        </div>
        {footer ? (
          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/70 px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-end sm:pb-3.5 [&_button]:w-full sm:[&_button]:w-auto">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

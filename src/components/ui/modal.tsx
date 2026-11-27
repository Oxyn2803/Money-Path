"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@/components/icons";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

/** Modal centralizado com overlay, Escape e clique fora para fechar. */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
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

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden
        className="absolute inset-0 animate-fade-in bg-primary-950/50"
        onClick={() => onOpenChange(false)}
      />
        {/*
         * Etapa 24: no móvil el panel ocupa todo el ancho, se alinea abajo
         * (patrón bottom-sheet) y **el contenido se desplaza**. Antes un
         * formulario largo quedaba recortado fuera del viewport y el botón
         * de guardar era inalcanzable — un bloqueo real en el teléfono.
         */}
        <div className="pointer-events-none relative flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={`pointer-events-auto flex max-h-[100dvh] w-full animate-slide-up flex-col overflow-hidden rounded-t-2xl border border-border bg-elevated shadow-overlay outline-none sm:max-h-[calc(100dvh-2rem)] sm:animate-scale-in sm:rounded-2xl ${SIZE_CLASSES[size]}`}
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border/70 px-5 py-4">
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
          {children ? (
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-4">
              {children}
            </div>
          ) : null}
          {footer ? (
            <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/70 px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-end sm:gap-2 sm:pb-3.5 [&>a]:w-full [&>a>button]:w-full [&>button]:w-full sm:[&>a]:w-auto sm:[&>a>button]:w-auto sm:[&>button]:w-auto">
              {footer}
            </footer>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

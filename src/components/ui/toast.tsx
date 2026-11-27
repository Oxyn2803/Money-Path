"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { IconAlertCircle, IconAlertTriangle, IconCheck, IconInfo, IconX } from "@/components/icons";

export type ToastVariant = "default" | "success" | "danger" | "warning" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Tempo em ms até fechar automaticamente (padrão 4500). */
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastOptions, "title">> {
  id: number;
  description?: string;
  variant: ToastVariant;
  /** Duración efectiva en ms (para la barra de progreso). */
  durationMs: number;
}

/** Barra de acento lateral por variante. */
const ACCENT_BAR: Record<ToastVariant, string> = {
  default: "bg-primary-500",
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
};

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  }
  return context;
}

const VARIANT_STYLES: Record<ToastVariant, { icon: ReactNode; accent: string }> = {
  default: { icon: <IconInfo size={16} />, accent: "text-primary-600" },
  success: { icon: <IconCheck size={16} />, accent: "text-success" },
  danger: { icon: <IconAlertCircle size={16} />, accent: "text-danger" },
  warning: { icon: <IconAlertTriangle size={16} />, accent: "text-warning" },
  info: { icon: <IconInfo size={16} />, accent: "text-info" },
};

/** Provedor de toasts — monte uma única vez no layout raiz. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = ++idRef.current;
      const duration = options.duration ?? 4500;
      setToasts((current) => [
        ...current.slice(-3),
        {
          id,
          title: options.title,
          description: options.description,
          variant: options.variant ?? "default",
          durationMs: duration,
        },
      ]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted
        ? createPortal(
            <div
              aria-live="polite"
              className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-4 sm:w-96"
            >
              {toasts.map((item) => {
                const styles = VARIANT_STYLES[item.variant];
                return (
                  <div
                    key={item.id}
                    role="status"
                    className="pointer-events-auto relative flex animate-toast-in items-start gap-3 overflow-hidden rounded-xl border border-border bg-elevated p-4 pl-5 shadow-elevated"
                  >
                    {/* Barra de acento: identifica el tipo de aviso de un vistazo. */}
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 w-1 ${ACCENT_BAR[item.variant]}`}
                    />
                    <span className={`mt-0.5 shrink-0 ${styles.accent}`}>{styles.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-text">{item.title}</p>
                      {item.description ? (
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      aria-label="Cerrar notificación"
                      onClick={() => dismiss(item.id)}
                      className="-m-1 grid h-8 w-8 shrink-0 place-items-center rounded-md text-faint transition-colors hover:bg-background hover:text-text"
                    >
                      <IconX size={13} />
                    </button>
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary-200/70 animate-toast-progress [animation-duration:4500ms] group-hover:[animation-play-state:paused]"
                      style={{ animationDuration: `${item.durationMs}ms` }}
                    />
                  </div>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { IconSpinner } from "@/components/icons";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "soft" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  /* Etapa 29: primary usa o accent verde-lima #a4f73d, texto escuro para contraste */
  primary:
    "shadow-sm",
  secondary:
    "border border-border-strong bg-surface text-text shadow-sm hover:bg-elevated hover:border-primary/40",
  ghost: "text-primary hover:bg-primary-soft",
  soft: "bg-primary-soft text-primary hover:bg-primary-soft/80",
  danger: "bg-danger text-white shadow-sm hover:bg-danger-strong",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
  md: "h-10 gap-2 rounded-xl px-4 text-sm",
  lg: "h-12 gap-2 rounded-xl px-5 text-[15px]",
};

/** Botão padrão do Money Path. */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      /*
       * Etapa 25: microinteracción — al presionar el botón se comprime muy
       * levemente (0.98) y vuelve; confirma la acción sin añadir ruido. Se
       * desactiva con prefers-reduced-motion por CSS global.
       */
      style={variant === "primary" ? { background: "#a4f73d", color: "#101210" } : undefined}
      className={`inline-flex select-none items-center justify-center font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...rest}
    >
      {loading ? <IconSpinner size={14} className="animate-spin" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}

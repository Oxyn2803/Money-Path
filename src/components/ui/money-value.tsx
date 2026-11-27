"use client";

import type { CurrencyCode } from "@/config/locales";
import { formatMoney, type MinorUnits } from "@/lib/money";
import { useLocale } from "@/lib/i18n";
import {
  IconAlertTriangle,
  IconArrowDownRight,
  IconArrowUpRight,
  IconTarget,
  IconTrendingUp,
  IconWallet,
} from "@/components/icons";

/**
 * Padrões visuais financeiros do Money Path.
 * Cada tipo de valor tem cor, sinal e ícone próprios:
 * - Receita → verde (positivo, +)
 * - Despesa → vermelho (negativo, −)
 * - Dívida → âmbar (atenção)
 * - Meta → petrol (progresso)
 * - Patrimônio → tinta escura (patrimonio líquido)
 * - Investimento → azul petróleo claro (crescimento)
 */
export type MoneyKind = "income" | "expense" | "debt" | "goal" | "equity" | "investment";

export interface MoneyValueProps {
  amount: MinorUnits;
  kind: MoneyKind;
  currency?: CurrencyCode;
  locale?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const KIND_STYLES: Record<
  MoneyKind,
  { text: string; sign: "" | "+" | "−"; icon: typeof IconWallet }
> = {
  income: { text: "text-f-income", sign: "+", icon: IconArrowUpRight },
  expense: { text: "text-f-expense", sign: "−", icon: IconArrowDownRight },
  debt: { text: "text-f-debt", sign: "", icon: IconAlertTriangle },
  goal: { text: "text-f-goal", sign: "", icon: IconTarget },
  equity: { text: "text-f-equity", sign: "", icon: IconWallet },
  investment: { text: "text-f-investment", sign: "", icon: IconTrendingUp },
};

const SIZE_CLASSES = {
  sm: "text-xs",
  md: "text-sm",
  lg: "font-display text-lg font-semibold",
} as const;

export function MoneyValue({
  amount,
  kind,
  currency,
  locale: localeProp,
  showIcon = false,
  size = "md",
  className = "",
}: MoneyValueProps) {
  const style = KIND_STYLES[kind];
  const Icon = style.icon;
  /*
   * Etapa 29: el idioma activo (contexto) gobierna el formato numérico —
   * así BRL sale como "R$ 1.234,56" en pt-BR y "MXN" en es-MX, sin
   * confundir idioma con moneda: la moneda sigue siendo la del dato.
   */
  const activeLocale = useLocale();
  const formatted = formatMoney(Math.abs(amount), {
    currency,
    locale: localeProp ?? activeLocale,
  });

  return (
    /*
     * Etapa 24: `max-w-full` + filho com `break-words`. Antes o valor era um
     * único nó de texto dentro de um flex item com `min-width: auto`, então
     * montantes longos ("$1,234,567.89") empurravam e estouravam cards
     * estreitos — exatamente o caso dos 7 indicadores do Money Path em telas
     * de 320 px, onde cada card tem ~150 px.
     */
    <span
      className={`inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 font-semibold tabular-nums ${style.text} ${SIZE_CLASSES[size]} ${className}`}
    >
      {showIcon ? <Icon size={size === "lg" ? 17 : 14} className="shrink-0" /> : null}
      <span className="min-w-0 break-words">
        {style.sign}
        {formatted}
      </span>
    </span>
  );
}

export interface SparklineProps {
  values: number[];
  tone?: "primary" | "success" | "info" | "accent";
  width?: number;
  height?: number;
  className?: string;
}

const SPARK_COLORS: Record<NonNullable<SparklineProps["tone"]>, string> = {
  primary: "var(--color-primary-500)",
  success: "var(--color-success)",
  info: "var(--color-f-investment)",
  accent: "var(--color-accent-500)",
};

/** Gráfico de linha limpo, sem dependências externas. */
export function Sparkline({
  values,
  tone = "primary",
  width = 160,
  height = 44,
  className = "",
}: SparklineProps) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 3;

  const points = values.map((value, index) => {
    const x = pad + (index / (values.length - 1)) * (width - pad * 2);
    const y = height - pad - ((value - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const color = SPARK_COLORS[tone];
  const lastPoint = points[points.length - 1].split(",");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      /*
       * Etapa 24: `max-w-full` mantém a proporção pelo viewBox e impede que o
       * sparkline de 160 px estoure um card mais estreito no celular.
       */
      className={`max-w-full ${className}`}
      aria-hidden="true"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r="2.6" fill={color} />
    </svg>
  );
}

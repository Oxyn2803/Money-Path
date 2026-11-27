/**
 * Catálogo de planes Money Path (Etapa 22 — Monetización).
 *
 * Fuente de verdad de precios, límites y matriz de funcionalidades. Es
 * configuración de producto versionada con el código (mismo criterio que el
 * catálogo de módulos en `config/modules.ts`): cambiar un precio es un cambio
 * revisable, no una fila editable que nadie audita.
 *
 * Todo monto vive en **centavos** (mínima unidad) para evitar puntos
 * flotantes; la moneda se declara aparte. Precios en USD.
 */

export type PlanId = "free" | "pro";

/** Periodicidad preparada desde el inicio: mensual y anual. */
export type BillingInterval = "month" | "year";

export type FeatureId =
  | "ingresos"
  | "gastos"
  | "presupuesto"
  | "dashboard"
  | "metas"
  | "patrimonio_basico"
  | "metas_ilimitadas"
  | "deudas"
  | "fondo"
  | "inversiones"
  | "patrimonio_completo"
  | "money_path"
  | "money_ai"
  | "reportes"
  | "calculadoras"
  | "academia";

/** Límite de metas del plan Free (breve de producto, Etapa 22). */
export const GOALS_FREE_LIMIT = 3;

export const FREE_GOALS_LIMIT_LABEL = `${GOALS_FREE_LIMIT} metas`;

export interface PlanPrice {
  /** Precio en centavos de la moneda `currency`. `null` = no aplica. */
  minor: number | null;
  currency: string;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  tagline: string;
  prices: Record<BillingInterval, PlanPrice>;
  /** Etiqueta comercial del precio (p. ej. "US$ 29.90 / año"). */
  priceLabel: Record<BillingInterval, string>;
}

export interface FeatureDefinition {
  id: FeatureId;
  /** Nombre visible en la tabla comparativa. */
  label: string;
  /** Detalle corto que desambigua el alcance real. */
  detail?: string;
  /** Grupo visual de la tabla: "esenciales" o "avanzado". */
  group: "esenciales" | "avanzado";
  /** Incluido en el plan Free. */
  free: boolean;
}

export const PLAN_CATALOG: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Para ordenar el día a día sin pagar nada.",
    prices: {
      month: { minor: 0, currency: "USD" },
      year: { minor: 0, currency: "USD" },
    },
    priceLabel: {
      month: "US$ 0.00 / mes",
      year: "US$ 0.00 / año",
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Todo el sistema: deudas, reserva, inversiones y tu ruta completa.",
    prices: {
      // Precio inicial de lanzamiento definido en el brief de producto.
      month: { minor: 390, currency: "USD" },
      year: { minor: 2990, currency: "USD" },
    },
    priceLabel: {
      month: "US$ 3.90 / mes",
      year: "US$ 29.90 / año",
    },
  },
};

/**
 * Matriz de funcionalidades. `free: false` ⇒ requiere Pro activo.
 * El orden define el orden de las filas de la tabla comparativa.
 */
export const FEATURES: FeatureDefinition[] = [
  { id: "ingresos", label: "Ingresos", detail: "Altas, edición y clasificación", group: "esenciales", free: true },
  { id: "gastos", label: "Gastos", detail: "Fijos y variables, por categoría", group: "esenciales", free: true },
  { id: "presupuesto", label: "Orçamento", detail: "Límites por categoría y recurrencias", group: "esenciales", free: true },
  { id: "dashboard", label: "Dashboard básico", detail: "Indicadores y gráficos del inicio", group: "esenciales", free: true },
  {
    id: "metas",
    label: "Metas",
    detail: `Hasta ${GOALS_FREE_LIMIT} metas activas`,
    group: "esenciales",
    free: true,
  },
  { id: "patrimonio_basico", label: "Patrimonio básico", detail: "Neto en el dashboard", group: "esenciales", free: true },
  { id: "metas_ilimitadas", label: "Metas ilimitadas", detail: "Sin tope de metas activas", group: "avanzado", free: false },
  { id: "deudas", label: "Dívidas", detail: "Saldos, abonos, avalancha y bola de nieve", group: "avanzado", free: false },
  { id: "fondo", label: "Fondo de emergência", detail: "Gasto esencial, meses objetivo y aportes", group: "avanzado", free: false },
  { id: "inversiones", label: "Inversiones", detail: "Cuentas, posiciones, aportes y rendimiento", group: "avanzado", free: false },
  { id: "patrimonio_completo", label: "Patrimonio completo", detail: "Activos, pasivos, valuación e histórico", group: "avanzado", free: false },
  { id: "money_path", label: "Money Path™", detail: "Ruta de acción y simulación de escenarios", group: "avanzado", free: false },
  { id: "money_ai", label: "Money AI", detail: "Asistente contextual sobre tus datos", group: "avanzado", free: false },
  { id: "reportes", label: "Relatórios", detail: "Informes por período, comparación e insights", group: "avanzado", free: false },
  { id: "calculadoras", label: "Calculadoras", detail: "Interés compuesto, meta, comprar vs rentar", group: "avanzado", free: false },
  { id: "academia", label: "Academia completa", detail: "8 categorías, 24 contenidos y progreso", group: "avanzado", free: false },
];

const FEATURE_INDEX: Map<FeatureId, FeatureDefinition> = new Map(
  FEATURES.map((feature) => [feature.id, feature]),
);

export function getFeature(feature: FeatureId): FeatureDefinition {
  const found = FEATURE_INDEX.get(feature);
  if (!found) throw new Error(`Feature desconocida: ${feature}`);
  return found;
}

/** ¿La feature está incluida en el plan indicado? */
export function planIncludes(plan: PlanId, feature: FeatureId): boolean {
  const definition = getFeature(feature);
  return plan === "pro" ? true : definition.free;
}

/** ¿El plan Free permite crear otra meta? */
export function allowsGoal(plan: PlanId, currentCount: number): boolean {
  if (plan === "pro") return true;
  return currentCount < GOALS_FREE_LIMIT;
}

export function formatMinor(minor: number, currency = "USD"): string {
  const amount = minor / 100;
  const symbol = currency === "USD" ? "US$ " : "";
  return `${symbol}${amount.toFixed(2)}`;
}

/** Ahorro anual real: 12 meses al precio mensual menos el precio anual. */
export function annualSavingsMinor(): number {
  const monthly = PLAN_CATALOG.pro.prices.month.minor ?? 0;
  const yearly = PLAN_CATALOG.pro.prices.year.minor ?? 0;
  return Math.max(0, monthly * 12 - yearly);
}

/** Porcentaje de ahorro anual respecto al plan mensual (entero). */
export function annualSavingsPercent(): number {
  const monthly = PLAN_CATALOG.pro.prices.month.minor ?? 0;
  if (monthly <= 0) return 0;
  return Math.round((annualSavingsMinor() / (monthly * 12)) * 100);
}

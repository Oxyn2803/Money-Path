import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { billingEvents, userSubscriptions } from "@/db/schema";
import {
  GOALS_FREE_LIMIT,
  getFeature,
  planIncludes,
  type BillingInterval,
  type FeatureId,
  type PlanId,
} from "@/config/plans";
import { getGatewayConfig } from "@/lib/billing-gateway";

/**
 * Motor de permisos de la Etapa 22 — Monetización.
 *
 * El plan del usuario se deriva **siempre** de la base de datos, nunca del
 * cliente. Una suscripción solo otorga Pro si está `active`/`trialing` y su
 * periodo sigue vigente: sin pago verificado no hay funcionalidad Pro.
 */

export type SubscriptionStatus =
  | "pending"
  | "incomplete"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "expired";

/** Estados que habilitan el plan Pro mientras el periodo esté vigente. */
const PRO_STATUSES: SubscriptionStatus[] = ["active", "trialing"];

export type SubscriptionRow = typeof userSubscriptions.$inferSelect;

export interface Entitlements {
  plan: PlanId;
  /** Estado de la suscripción real; `none` cuando nunca hubo una. */
  status: SubscriptionStatus | "none";
  subscription: SubscriptionRow | null;
  /** ¿Plan Pro vigente? */
  pro: boolean;
  /** Máximo de metas activas; `null` = ilimitado (Pro). */
  goalsLimit: number | null;
  /** ¿La feature está incluida en el plan vigente? */
  has: (feature: FeatureId) => boolean;
}

export async function getSubscription(userId: string): Promise<SubscriptionRow | null> {
  const rows = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .limit(1);
  return rows[0] ?? null;
}

/** Pro solo si el estado lo permite y el periodo no está vencido. */
export function isProSubscription(
  subscription: SubscriptionRow | null,
  now: Date = new Date(),
): boolean {
  if (!subscription || subscription.plan !== "pro") return false;
  if (!PRO_STATUSES.includes(subscription.status)) return false;
  if (subscription.currentPeriodEnd && subscription.currentPeriodEnd.getTime() < now.getTime()) {
    return false;
  }
  return true;
}

export async function getEntitlements(userId: string): Promise<Entitlements> {
  const subscription = await getSubscription(userId);
  const pro = isProSubscription(subscription);
  const plan: PlanId = pro ? "pro" : "free";
  return {
    plan,
    status: (subscription?.status as SubscriptionStatus | undefined) ?? "none",
    subscription,
    pro,
    goalsLimit: pro ? null : GOALS_FREE_LIMIT,
    has: (feature: FeatureId) => planIncludes(plan, feature),
  };
}

/** Bitácora auditable de todo evento de facturación. */
export async function logBillingEvent(event: {
  userId: string;
  type: string;
  plan?: PlanId | null;
  interval?: BillingInterval | null;
  provider?: string | null;
  status?: string;
  payload: Record<string, unknown>;
  processed?: boolean;
}): Promise<void> {
  await db.insert(billingEvents).values({
    userId: event.userId,
    type: event.type,
    plan: event.plan ?? null,
    interval: event.interval ?? null,
    provider: event.provider ?? null,
    status: event.status ?? "ok",
    payload: event.payload,
    processedAt: event.processed === false ? null : new Date(),
  });
}

/** Historial reciente de facturación del usuario (para la página de estado). */
export async function getBillingHistory(userId: string, limit = 20) {
  return db
    .select()
    .from(billingEvents)
    .where(eq(billingEvents.userId, userId))
    .orderBy(desc(billingEvents.createdAt))
    .limit(limit);
}

export interface PremiumRequiredBody {
  error: "premium_required";
  feature: FeatureId;
  label: string;
  requiredPlan: "pro";
  currentPlan: PlanId;
  /** Sugerencia honesta de upgrade (sin simular pagos). */
  upgradePath: string;
}

/** Respuesta 402 estándar para endpoints restringidos a Pro. */
export function premiumRequiredResponse(
  entitlements: Entitlements,
  feature: FeatureId,
): NextResponse<PremiumRequiredBody> {
  return NextResponse.json(
    {
      error: "premium_required",
      feature,
      label: getFeature(feature).label,
      requiredPlan: "pro",
      currentPlan: entitlements.plan,
      upgradePath: "/precios",
    },
    { status: 402 },
  );
}

/**
 * Guardia de servidor para rutas API: `null` si el acceso está permitido,
 * o la respuesta 402 que debe devolverse tal cual.
 */
export async function guardFeature(
  userId: string,
  feature: FeatureId,
): Promise<{ entitlements: Entitlements; denied: null } | { entitlements: Entitlements; denied: NextResponse }> {
  const entitlements = await getEntitlements(userId);
  if (entitlements.has(feature)) return { entitlements, denied: null };
  return { entitlements, denied: premiumRequiredResponse(entitlements, feature) };
}

/** Estado resumido para la página de suscripción y el checkout. */
export function describeSubscription(entitlements: Entitlements) {
  const gateway = getGatewayConfig();
  const subscription = entitlements.subscription;
  return {
    plan: entitlements.plan,
    status: entitlements.status,
    interval: subscription?.interval ?? null,
    priceMinor: subscription?.priceMinor ?? null,
    currency: subscription?.currency ?? "USD",
    currentPeriodStart: subscription?.currentPeriodStart ?? null,
    currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
    provider: subscription?.provider ?? gateway.provider,
    providerSubscriptionId: subscription?.providerSubscriptionId ?? null,
    gatewayConfigured: gateway.configured,
    gatewayImplemented: gateway.implemented,
    goalsLimit: entitlements.goalsLimit,
  };
}

import Link from "next/link";
import type { ReactNode } from "react";
import { getFeature, type FeatureId } from "@/config/plans";
import { getEntitlements } from "@/lib/billing";
import { getSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { IconArrowRight, IconCheck, IconLock } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "./upgrade-button";
import { ProStamp } from "./pro-stamp";

export interface PremiumGateProps {
  feature: FeatureId;
  /** Contenido protegido; solo se renderiza con Pro vigente. */
  children?: ReactNode;
  /**
   * Permisos ya calculados por la página (evita una consulta duplicada).
   * Si se omiten, el gate resuelve el plan en servidor.
   */
  entitlements?: {
    has: (feature: FeatureId) => boolean;
  };
}

/**
 * Bloqueo elegante de recursos premium (Etapa 22).
 *
 * Se coloca *dentro* del `PageShell`, de modo que el usuario sigue viendo el
 * título y la descripción del módulo: sabe exactamente qué está bloqueado y
 * por qué, con una salida clara hacia los planes. La verificación ocurre en
 * servidor contra la base de datos — nunca se confía en el cliente.
 */
export async function PremiumGate({ feature, children, entitlements }: PremiumGateProps) {
  const dict = await getDictionary();

  let allowed: boolean;
  if (entitlements) {
    allowed = entitlements.has(feature);
  } else {
    const session = await getSession();
    allowed = session ? (await getEntitlements(session.user.id)).has(feature) : false;
  }

  if (allowed) return <>{children}</>;
  const session = await getSession();

  const definition = getFeature(feature);
  const copy = dict.billing.gate;
  const title = copy.title.replace("{feature}", definition.label);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-700 via-accent-400 to-primary-700" />

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-950 text-accent-300">
              <IconLock size={18} />
            </span>
            <Badge tone="accent" dot>
              {copy.badge}
            </Badge>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-faint">
              {dict.billing.common.currentPlan}: {dict.billing.common.free}
            </span>
          </div>

          <h2 className="mt-5 font-display text-2xl font-bold leading-tight tracking-tight text-primary-950">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{copy.lead}</p>

          <ul className="mt-5 grid gap-2.5">
            {copy.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-text">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-600">
                  <IconCheck size={12} />
                </span>
                <span className="leading-snug">{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <UpgradeButton featureLabel={definition.label} iconRight={<IconArrowRight size={15} />}>
              {copy.cta}
            </UpgradeButton>
            <Link href="/precios">
              <Button variant="secondary">{dict.billing.common.viewPlans}</Button>
            </Link>
            {session ? (
              <Link href="/app/suscripcion">
                <Button variant="ghost">{copy.secondary}</Button>
              </Link>
            ) : null}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-faint">{copy.honestNote}</p>
        </div>

        <aside className="relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border-strong bg-background px-6 py-8 text-center">
          <ProStamp size={104} className="-rotate-6 text-accent-500/85" />
          <div>
            <p className="font-display text-lg font-bold text-primary-950">
              {dict.billing.common.pro} · {dict.billing.pricing.priceProYear}
            </p>
            <p className="mt-1 text-xs text-muted">
              {dict.billing.pricing.priceProYear} {dict.billing.common.perYear} —{" "}
              {dict.billing.pricing.priceProMonth} {dict.billing.common.perMonth}
            </p>
          </div>
          <p className="text-[11px] leading-relaxed text-faint">
            {dict.billing.subscription.freeNotice}
          </p>
        </aside>
      </div>
    </section>
  );
}

/**
 * Aviso de límite de metas del plan Free (Etapa 22).
 * Se muestra dentro de Metas cuando el usuario ya usa sus 3 metas: el módulo
 * sigue visible y funcional, pero la creación queda bloqueada con salida a Pro.
 */
export async function GoalLimitNotice({ limit }: { limit: number }) {
  const dict = await getDictionary();
  const copy = dict.billing.goals;

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent-200 bg-accent-100/60 px-5 py-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-100 text-accent-600">
            <IconLock size={15} />
          </span>
          <p className="font-display text-sm font-bold text-accent-600">{copy.limitTitle}</p>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          {copy.limitBody.replace("{limit}", String(limit))}
        </p>
      </div>
      <Link href="/precios">
        <Button variant="secondary" size="sm">
          {copy.limitCta}
        </Button>
      </Link>
    </section>
  );
}

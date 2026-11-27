import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { ProStamp } from "@/components/billing/pro-stamp";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { IconArrowRight, IconInfo, IconLock } from "@/components/icons";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SubscriptionStatus } from "@/lib/billing";
import { describeSubscription, getBillingHistory, getEntitlements } from "@/lib/billing";
import { getSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { formatMinor } from "@/config/plans";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Planes y suscripción — Money Path",
};

const STATUS_TONE: Record<SubscriptionStatus | "none", BadgeTone> = {
  none: "neutral",
  pending: "warning",
  incomplete: "warning",
  active: "success",
  trialing: "info",
  past_due: "danger",
  canceled: "neutral",
  expired: "neutral",
};

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * Estado de la suscripción (Etapa 22 — UX de monetización).
 *
 * Muestra únicamente datos reales de `user_subscriptions` y `billing_events`.
 * Cuando no hay gateway, se dice con todas las letras: ningún cobro se
 * procesó y el plan sigue en Free.
 */
export default async function SuscripcionPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userId = session.user.id;
  const [entitlements, history] = await Promise.all([
    getEntitlements(userId),
    getBillingHistory(userId, 20),
  ]);
  const info = describeSubscription(entitlements);
  const dict = await getDictionary();
  const copy = dict.billing.subscription;
  const common = dict.billing.common;

  const statusLabel = copy.statusLabels[info.status];
  const intervalLabel =
    info.interval === "year"
      ? common.annual
      : info.interval === "month"
        ? common.monthly
        : "—";

  const rows: { label: string; value: string; badge?: BadgeTone }[] = [
    { label: copy.rows.plan, value: info.plan === "pro" ? common.pro : common.free },
    { label: copy.rows.status, value: statusLabel, badge: STATUS_TONE[info.status] },
    { label: copy.rows.interval, value: intervalLabel },
    {
      label: copy.rows.price,
      value: info.priceMinor != null ? `${formatMinor(info.priceMinor, info.currency)}` : "—",
    },
    { label: copy.rows.periodStart, value: formatDate(info.currentPeriodStart) },
    { label: copy.rows.periodEnd, value: formatDate(info.currentPeriodEnd) },
    {
      label: copy.rows.nextBilling,
      value:
        info.plan === "pro" && info.currentPeriodEnd && !info.cancelAtPeriodEnd
          ? formatDate(info.currentPeriodEnd)
          : "—",
    },
    { label: copy.rows.provider, value: info.provider ?? "—" },
    { label: copy.rows.reference, value: info.providerSubscriptionId ?? "—" },
    {
      label: copy.rows.goalsLimit,
      value: info.goalsLimit === null ? dict.billing.common.unlimited : `${info.goalsLimit}`,
    },
  ];

  return (
    <PageShell navId="suscripcion" active={info.plan === "pro"}>
      {/* ── Estado ─────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl ${
                info.plan === "pro"
                  ? "bg-primary-950 text-accent-300"
                  : "bg-primary-soft text-primary-700"
              }`}
            >
              <IconLock size={17} />
            </span>
            <div>
              <p className="font-display text-base font-bold text-primary-950">
                {copy.statusTitle}
              </p>
              <p className="text-xs text-muted">
                {info.plan === "pro" ? common.pro : common.free} · {statusLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {info.plan === "pro" ? (
              <ProStamp size={56} className="rotate-[-8deg] text-accent-500/85" />
            ) : (
              <Badge tone="outline">{common.free}</Badge>
            )}
            <UpgradeButton size="sm" variant="primary" iconRight={<IconArrowRight size={14} />}>
              {copy.upgradeCta}
            </UpgradeButton>
          </div>
        </div>

        {info.plan === "pro" ? null : (
          <div className="flex items-start gap-3 border-b border-border bg-background px-5 py-4">
            <IconInfo size={16} className="mt-0.5 shrink-0 text-primary-600" />
            <div>
              <p className="text-sm font-bold text-text">{copy.emptyStatus}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{copy.emptyBody}</p>
            </div>
          </div>
        )}

        <dl className="divide-y divide-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3"
            >
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="text-right font-display text-sm font-bold tabular-nums text-text">
                {row.badge ? (
                  <Badge tone={row.badge}>{row.value}</Badge>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="border-t border-border bg-background px-5 py-3 text-xs leading-relaxed text-faint">
          {copy.freeNotice}
        </p>
      </section>

      {/* ── Pasarela de pagos: honestidad sobre el estado real ──── */}
      <section className="grid overflow-hidden rounded-2xl border border-border bg-surface shadow-card sm:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="p-5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-warning" />
            <h2 className="font-display text-base font-bold text-primary-950">
              {copy.gatewayTitle}
            </h2>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-muted">
            {info.gatewayConfigured
              ? copy.gatewayConfigured.replace("{provider}", info.provider ?? "—")
              : copy.gatewayNotConfigured}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/precios">
              <Button size="sm" variant="secondary">
                {dict.billing.common.viewPlans}
              </Button>
            </Link>
            <UpgradeButton size="sm" variant="ghost" featureLabel={common.pro}>
              {dict.billing.gate.cta}
            </UpgradeButton>
          </div>
        </div>
        <div className="relative hidden min-h-[170px] sm:block">
          <img
            src="/images/gateway-desk.jpg"
            alt="Terminal de pago apagado sobre un escritorio de papel"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/30 to-transparent" />
        </div>
      </section>

      {/* ── Bitácora ───────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-bold text-primary-950">
            {copy.historyTitle}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">{copy.historyHint}</p>
        </div>

        {history.length === 0 ? (
          <p className="px-5 py-6 text-sm text-faint">{copy.historyEmpty}</p>
        ) : (
          <ul className="divide-y divide-border">
            {history.map((event) => (
              <li
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs font-semibold text-text">
                    {event.type}
                  </p>
                  <p className="mt-0.5 text-[11px] text-faint">
                    {formatDate(event.createdAt)}
                    {event.interval ? ` · ${event.interval === "year" ? common.annual : common.monthly}` : ""}
                    {event.provider ? ` · ${event.provider}` : ""}
                  </p>
                </div>
                <Badge
                  tone={
                    event.status === "ok" || event.status === "processed"
                      ? "success"
                      : event.status === "no_subscription"
                        ? "neutral"
                        : "warning"
                  }
                >
                  {event.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}

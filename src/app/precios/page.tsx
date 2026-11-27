import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getEntitlements } from "@/lib/billing";
import { getDictionary } from "@/lib/i18n";
import { Wordmark } from "@/components/wordmark";
import { PricingTable } from "@/components/billing/pricing-table";
import { IconArrowRight, IconCheck } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Planes — Money Path",
  description:
    "Free para el día a día y Pro para el sistema completo: dívidas, fondo de emergencia, inversiones, Money Path™, Money AI, relatórios y Academia. US$ 29.90 al año.",
};

/**
 * Página pública de planes (Etapa 22 — UX de monetización).
 * Presenta la comparación como una tarifa impresa, con el sello PRO sobre
 * la columna Pro y una nota explícita sobre el estado del gateway.
 */
export default async function PricingPage() {
  const dict = await getDictionary();
  const copy = dict.billing;
  const session = await getSession();
  const entitlements = session ? await getEntitlements(session.user.id) : null;

  const freeIncludes = [
    copy.pricing.lead,
  ];

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
          <Link href="/" aria-label="Money Path — Inicio">
            <Wordmark />
          </Link>
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/"
              className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-muted transition-colors hover:bg-surface hover:text-text sm:text-sm"
            >
              {dict.nav.links.site}
            </Link>
            {session ? (
              <Link href="/app">
                <Button size="sm" variant="primary">
                  {dict.nav.items.inicio}
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-muted transition-colors hover:bg-surface hover:text-text sm:text-sm"
                >
                  {dict.auth.login.title}
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="primary" iconRight={<IconArrowRight size={14} />}>
                    {copy.pricing.freeCta}
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-10 sm:pt-14">
        {/* Banda de apertura: papel de estado de cuenta */}
        <section className="relative overflow-hidden rounded-3xl border border-border">
          <img
            src="/images/pricing-ledger.jpg"
            alt=""
            aria-hidden
            width={1536}
            height={1024}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/40" />
          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-600">
              {copy.pricing.eyebrow}
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-[1.08] tracking-tight text-primary-950 sm:text-5xl">
              {copy.pricing.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {copy.pricing.lead}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge tone="accent">{copy.common.saveLabel
                .replace("{amount}", "US$ 16.90")
                .replace("{percent}", "36")}</Badge>
              <span className="text-xs text-faint">{copy.pricing.noPaymentYet}</span>
            </div>
          </div>
        </section>

        {/* La tabla es el héroe */}
        <section className="mt-10" aria-label={copy.pricing.tableCaption}>
          <PricingTable
            authenticated={Boolean(session)}
            currentPlan={entitlements?.plan ?? null}
          />
          <p className="mt-3 px-1 text-xs leading-relaxed text-faint">{copy.pricing.note}</p>
        </section>

        {/* Preguntas honestas */}
        <section className="mt-14">
          <h2 className="font-display text-xl font-bold tracking-tight text-primary-950">
            {copy.pricing.faqTitle}
          </h2>
          <dl className="mt-5 divide-y divide-border border-y border-border">
            {copy.pricing.faq.map((item) => (
              <div key={item.q} className="grid gap-2 py-5 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-8">
                <dt className="flex items-start gap-2 text-sm font-bold text-text">
                  <IconCheck size={15} className="mt-0.5 shrink-0 text-accent-500" />
                  {item.q}
                </dt>
                <dd className="text-sm leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 rounded-2xl border border-warning/25 bg-warning-soft px-5 py-5">
          <p className="text-sm font-bold text-warning-strong">{copy.upgrade.noGatewayTitle}</p>
          <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-warning-strong/90">
            {copy.upgrade.noGatewayBody}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/register">
              <Button variant="primary" size="sm">
                {copy.pricing.freeCta}
              </Button>
            </Link>
            <Link href="/precios">
              <Button variant="secondary" size="sm">
                {copy.common.viewSubscription}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>{dict.meta.tagline}</span>
          <span>{freeIncludes[0]}</span>
        </div>
      </footer>
    </div>
  );
}

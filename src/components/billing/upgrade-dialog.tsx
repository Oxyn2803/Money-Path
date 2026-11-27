"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconLock,
} from "@/components/icons";
import { useDictionary } from "@/lib/i18n";
import {
  PLAN_CATALOG,
  annualSavingsMinor,
  annualSavingsPercent,
  formatMinor,
  type BillingInterval,
} from "@/config/plans";

export interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Feature que motivó el upgrade (para el encabezado contextual). */
  featureLabel?: string;
}

interface CheckoutResponse {
  ok: boolean;
  code: string;
  message: string;
  provider?: string | null;
  interval?: BillingInterval;
  priceMinor?: number;
  currency?: string;
  activated?: boolean;
}

type Phase = "idle" | "loading" | "result";

/**
 * Diálogo de upgrade (Etapa 22).
 *
 * Nunca muestra un estado de éxito: el checkout responde con un código
 * honesto cuando no hay gateway y el diálogo explica exactamente eso.
 */
export function UpgradeDialog({ open, onOpenChange, featureLabel }: UpgradeDialogProps) {
  const dict = useDictionary();
  const copy = dict.billing.upgrade;
  const [interval, setInterval] = useState<BillingInterval>("year");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<CheckoutResponse | null>(null);

  const plan = PLAN_CATALOG.pro;
  const price = plan.prices[interval];

  async function handleCheckout() {
    setPhase("loading");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro", interval }),
      });
      const data = (await response.json()) as CheckoutResponse;
      if (response.status === 401) {
        setResult({
          ok: false,
          code: "UNAUTHORIZED",
          message: "Inicia sesión para continuar al pago. No se realizó ningún cobro.",
        });
        return;
      }
      setResult(data);
    } catch {
      setResult({
        ok: false,
        code: "NETWORK_ERROR",
        message: "No se pudo contactar al servidor. No se realizó ningún cobro.",
      });
    } finally {
      setPhase("result");
    }
  }

  function handleClose() {
    onOpenChange(false);
    window.setTimeout(() => {
      setPhase("idle");
      setResult(null);
    }, 200);
  }

  const intervalOptions: BillingInterval[] = ["year", "month"];

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={featureLabel ? `${copy.title} · ${featureLabel}` : copy.title}
      description={copy.subtitle}
      size="md"
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={handleClose}>
            {phase === "result" ? copy.keepFree : copy.close}
          </Button>
          {phase !== "result" ? (
            <Button
              onClick={handleCheckout}
              loading={phase === "loading"}
              iconRight={<IconArrowRight size={15} />}
            >
              {phase === "loading" ? copy.processing : copy.payNow}
            </Button>
          ) : (
            <Link href="/app/suscripcion" onClick={handleClose}>
              <Button variant="soft">{dict.billing.common.viewSubscription}</Button>
            </Link>
          )}
        </div>
      }
    >
      {phase !== "result" ? (
        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">
              {copy.chooseInterval}
            </p>
            <div className="flex flex-col gap-2">
              {intervalOptions.map((option) => {
                const optionPrice = plan.prices[option];
                const active = interval === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setInterval(option)}
                    aria-pressed={active}
                    className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-primary-500 bg-primary-50"
                        : "border-border bg-surface hover:border-border-strong"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border-2 ${
                          active ? "border-primary-600 bg-primary-600" : "border-border-strong"
                        }`}
                      >
                        {active ? <IconCheck size={11} className="text-white" /> : null}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-text">
                          {option === "year"
                            ? dict.billing.common.annual
                            : dict.billing.common.monthly}
                        </span>
                        <span className="block text-xs text-muted">
                          {option === "year"
                            ? dict.billing.common.equivalent.replace(
                                "{amount}",
                                formatMinor(
                                  Math.round((plan.prices.year.minor ?? 0) / 12),
                                ),
                              )
                            : copy.dueOnBilling}
                        </span>
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-display text-base font-bold tabular-nums text-primary-950">
                        {formatMinor(optionPrice.minor ?? 0)}
                      </span>
                      <span className="block text-[11px] text-faint">
                        {option === "year"
                          ? dict.billing.common.perYear
                          : dict.billing.common.perMonth}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">
              {copy.summary}
            </p>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-muted">{copy.dueNow}</span>
              <span className="font-display text-xl font-bold tabular-nums text-primary-950">
                {formatMinor(price.minor ?? 0)}
              </span>
            </div>
            {interval === "year" ? (
              <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                <Badge tone="accent">
                  {dict.billing.common.saveLabel
                    .replace("{amount}", formatMinor(annualSavingsMinor()))
                    .replace("{percent}", String(annualSavingsPercent()))}
                </Badge>
              </p>
            ) : null}
          </div>

          <p className="rounded-xl border border-warning/25 bg-warning-soft px-4 py-3 text-xs leading-relaxed text-warning-strong">
            {copy.noGatewayBody}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-xl border border-warning/25 bg-warning-soft p-4">
            <IconAlertTriangle size={18} className="mt-0.5 shrink-0 text-warning-strong" />
            <div>
              <p className="text-sm font-bold text-warning-strong">
                {result?.code === "NETWORK_ERROR"
                  ? copy.adapterPendingTitle
                  : copy.noGatewayTitle}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-warning-strong/90">
                {result?.message ?? copy.noGatewayBody}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <IconLock size={14} className="text-faint" />
            <span className="font-mono">{copy.errorCode.replace("{code}", result?.code ?? "—")}</span>
          </div>

          <p className="text-xs leading-relaxed text-faint">{dict.billing.subscription.freeNotice}</p>
        </div>
      )}
    </Modal>
  );
}

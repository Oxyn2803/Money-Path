"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FEATURES,
  PLAN_CATALOG,
  annualSavingsMinor,
  annualSavingsPercent,
  formatMinor,
  type BillingInterval,
  type FeatureId,
  type PlanId,
} from "@/config/plans";
import { useDictionary } from "@/lib/i18n";
import { IconCheck, IconMinus } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "./upgrade-button";
import { ProStamp } from "./pro-stamp";

export interface PricingTableProps {
  /** Plan vigente del usuario, si tiene sesión. */
  currentPlan?: PlanId | null;
  authenticated?: boolean;
}

/**
 * Tabla comparativa de planes (Etapa 22).
 *
 * Tratada como una **tarifa impresa**: filas con filetes capilares, cifras
 * tabulares, grupos en versalitas y el sello PRO estampado sobre la columna
 * Pro. La columna Pro lleva un lavado de pigmento petróleo para que la
 * jerarquía se lea de un vistazo, sin tarjetas flotantes.
 */
export function PricingTable({ currentPlan = null, authenticated = false }: PricingTableProps) {
  const dict = useDictionary();
  const copy = dict.billing;
  const [interval, setInterval] = useState<BillingInterval>("year");

  const free = PLAN_CATALOG.free;
  const pro = PLAN_CATALOG.pro;
  const proPrice = pro.prices[interval];

  const groups: { id: "esenciales" | "avanzado"; label: string }[] = [
    { id: "esenciales", label: copy.pricing.groupEssentials },
    { id: "avanzado", label: copy.pricing.groupAdvanced },
  ];

  function cellValue(feature: FeatureId, plan: PlanId): "yes" | "no" | string {
    if (feature === "metas") return plan === "free" ? "3" : "∞";
    return plan === "pro" || FEATURES.find((entry) => entry.id === feature)?.free
      ? "yes"
      : "no";
  }

  const proCta = authenticated ? (
    <UpgradeButton size="sm" fullWidth variant="primary">
      {copy.pricing.proCta}
    </UpgradeButton>
  ) : (
    <Link href="/register" className="block w-full">
      <Button size="sm" variant="primary" fullWidth>
        {copy.pricing.proCta}
      </Button>
    </Link>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      {/* Barra de periodicidad */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-background px-4 py-3.5 sm:px-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-faint">
            {copy.pricing.billingToggle}
          </p>
          <div className="mt-1.5 inline-flex rounded-lg border border-border-strong bg-surface p-0.5">
            {(["month", "year"] as BillingInterval[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setInterval(option)}
                aria-pressed={interval === option}
                className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  interval === option
                    ? "bg-primary-600 text-primary-50 shadow-sm"
                    : "text-muted hover:text-text"
                }`}
              >
                {option === "year" ? copy.common.annual : copy.common.monthly}
              </button>
            ))}
          </div>
        </div>
        <Badge tone="accent">
          {copy.common.saveLabel
            .replace("{amount}", formatMinor(annualSavingsMinor()))
            .replace("{percent}", String(annualSavingsPercent()))}
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{copy.pricing.tableCaption}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[46%] px-4 py-4 align-bottom sm:px-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-faint">
                  {copy.pricing.featureColumn}
                </span>
              </th>
              <th scope="col" className="w-[25%] px-3 py-4 align-bottom sm:px-4">
                <span className="block font-display text-lg font-bold text-primary-950">
                  {free.name}
                </span>
                <span className="mt-0.5 block text-xs tabular-nums text-muted">
                  {copy.pricing.priceFree} {copy.common.perYear}
                </span>
              </th>
              <th
                scope="col"
                className="relative w-[29%] border-x border-primary-100 bg-primary-50/70 px-3 py-4 align-bottom sm:px-4"
              >
                <span className="absolute -top-2.5 right-1 sm:right-2">
                  <ProStamp size={44} className="rotate-[8deg] text-accent-500/80 sm:hidden" />
                </span>
                <span className="absolute -top-2.5 right-2 hidden sm:block">
                  <ProStamp size={54} className="rotate-[8deg] text-accent-500/80" />
                </span>
                <span className="block font-display text-lg font-bold text-primary-950">
                  {pro.name}
                </span>
                <span className="mt-0.5 block text-xs font-semibold tabular-nums text-primary-800">
                  {interval === "year" ? copy.pricing.priceProYear : copy.pricing.priceProMonth}{" "}
                  {interval === "year" ? copy.common.perYear : copy.common.perMonth}
                </span>
              </th>
            </tr>
          </thead>

          {groups.map((group) => (
            <tbody key={group.id}>
              <tr>
                <td
                  colSpan={3}
                  className="border-y border-border bg-background px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-faint sm:px-6"
                >
                  {group.label}
                </td>
              </tr>
              {FEATURES.filter((feature) => feature.group === group.id).map((feature) => (
                <tr key={feature.id} className="group/row">
                  <td className="border-b border-border px-4 py-3 align-top sm:px-6">
                    <span className="block text-sm font-semibold leading-snug text-text">
                      {feature.label}
                    </span>
                    {/*
                     * Etapa 24: o detalhe da funcionalidade deixou de ser
                     * escondido no celular — era a única explicação do alcance
                     * real de cada linha na comparação.
                     */}
                    {feature.detail ? (
                      <span className="mt-0.5 block text-xs leading-snug text-faint">
                        {feature.detail}
                      </span>
                    ) : null}
                  </td>
                  <td className="border-b border-border px-3 py-3 text-center align-middle sm:px-4">
                    <FeatureCell value={cellValue(feature.id, "free")} tone="free" />
                  </td>
                  <td className="border-b border-x border-primary-100 bg-primary-50/40 px-3 py-3 text-center align-middle sm:px-4">
                    <FeatureCell value={cellValue(feature.id, "pro")} tone="pro" />
                  </td>
                </tr>
              ))}
            </tbody>
          ))}

          <tfoot>
            <tr>
              <td className="px-4 py-4 sm:px-6" />
              <td className="px-3 py-4 text-center sm:px-4">
                <Link href="/register" className="block w-full">
                  <Button size="sm" variant="secondary" fullWidth>
                    {copy.pricing.freeCta}
                  </Button>
                </Link>
                {currentPlan === "free" ? (
                  <span className="mt-2 block text-[11px] font-semibold text-primary-700">
                    {copy.common.currentPlan}
                  </span>
                ) : null}
              </td>
              <td className="border-x border-primary-100 bg-primary-50/70 px-3 py-4 sm:px-4">
                {currentPlan === "pro" ? (
                  <span className="block text-center text-[11px] font-bold text-primary-800">
                    {copy.common.currentPlan}
                  </span>
                ) : (
                  proCta
                )}
                <span className="mt-2 block text-center text-[11px] tabular-nums text-muted">
                  {interval === "year"
                    ? copy.common.equivalent.replace(
                        "{amount}",
                        formatMinor(Math.round((pro.prices.year.minor ?? 0) / 12)),
                      )
                    : copy.pricing.note}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function FeatureCell({ value, tone }: { value: "yes" | "no" | string; tone: "free" | "pro" }) {
  if (value === "yes") {
    return (
      <span
        className={`inline-grid h-6 w-6 place-items-center rounded-full ${
          tone === "pro" ? "bg-accent-100 text-accent-600" : "bg-primary-50 text-primary-700"
        }`}
        aria-label="Incluido"
      >
        <IconCheck size={13} />
      </span>
    );
  }
  if (value === "no") {
    return <IconMinus size={14} className="mx-auto text-border-strong" aria-label="No incluido" />;
  }
  return (
    <span className="font-display text-sm font-bold tabular-nums text-primary-950">{value}</span>
  );
}

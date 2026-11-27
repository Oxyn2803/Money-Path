import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { MoneyAIModule, type ContextCardItem } from "@/components/moneyai/moneyai-client";
import type { CurrencyCode } from "@/config/locales";
import { PremiumGate } from "@/components/billing/premium-gate";
import { getSession } from "@/lib/auth";
import { getEntitlements } from "@/lib/billing";
import { getDictionary } from "@/lib/i18n";
import { formatMoney } from "@/lib/money";
import { buildAIContext } from "@/lib/moneyai/context";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Money AI — Money Path",
};

export default async function MoneyAIPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const entitlements = await getEntitlements(session.user.id);
  if (!entitlements.has("money_ai")) {
    return (
      <PageShell navId="money_ai">
        <PremiumGate feature="money_ai" entitlements={entitlements} />
      </PageShell>
    );
  }

  const context = await buildAIContext(session.user.id);
  if (!context) redirect("/onboarding");

  const dict = await getDictionary();
  const currency = context.currency as CurrencyCode;
  const money = (minor: number) => formatMoney(minor, { currency });

  const contextCards: ContextCardItem[] = [
    { label: dict.moneyAI.contextLabels.income, value: money(context.monthlyIncomeMinor) },
    { label: dict.moneyAI.contextLabels.expenses, value: money(context.monthlyExpensesMinor) },
    { label: dict.moneyAI.contextLabels.balance, value: money(context.surplusMinor) },
    { label: dict.moneyAI.contextLabels.fund, value: money(context.fundCurrentMinor) },
    { label: dict.moneyAI.contextLabels.debts, value: money(context.debtsTotalMinor) },
    { label: dict.moneyAI.contextLabels.netWorth, value: money(context.netWorthMinor) },
  ];

  return (
    <PageShell navId="money_ai" active>
      <MoneyAIModule contextCards={contextCards} showNoDataNote={!context.hasActualData} />
    </PageShell>
  );
}

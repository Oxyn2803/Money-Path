import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { DebtsModule } from "@/components/debts/debts-client";
import { PremiumGate } from "@/components/billing/premium-gate";
import { getSession } from "@/lib/auth";
import { getEntitlements } from "@/lib/billing";
import { getDebtsData } from "@/lib/debts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Deudas — Money Path",
};

export default async function DeudasPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const entitlements = await getEntitlements(session.user.id);
  if (!entitlements.has("deudas")) {
    return (
      <PageShell navId="deudas">
        <PremiumGate feature="deudas" entitlements={entitlements} />
      </PageShell>
    );
  }

  const data = await getDebtsData(session.user.id);
  if (!data) redirect("/onboarding");

  return (
    <PageShell navId="deudas" active>
      <DebtsModule
        currency={data.currency}
        debts={data.debts}
        summary={data.summary}
        alerts={data.alerts}
        surplusMinor={data.monthlySurplusMinor}
      />
    </PageShell>
  );
}

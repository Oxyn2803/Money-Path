import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { MoneyPathModule } from "@/components/moneypath/moneypath-client";
import { PremiumGate } from "@/components/billing/premium-gate";
import { getSession } from "@/lib/auth";
import { getEntitlements } from "@/lib/billing";
import { getMoneyPathData, recordMoneyPathState } from "@/lib/moneypath";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Money Path™ — Tu Ruta Financiera",
};

export default async function MoneyPathPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const entitlements = await getEntitlements(session.user.id);
  if (!entitlements.has("money_path")) {
    return (
      <PageShell navId="money_path">
        <PremiumGate feature="money_path" entitlements={entitlements} />
      </PageShell>
    );
  }

  const data = await getMoneyPathData(session.user.id);
  if (!data) redirect("/onboarding");

  // Registra el estado de la ruta (máximo uno por día) para auditoría.
  await recordMoneyPathState(session.user.id, data);

  return (
    <PageShell navId="money_path" active>
      <MoneyPathModule data={data} />
    </PageShell>
  );
}

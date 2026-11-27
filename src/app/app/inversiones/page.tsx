import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { InvestmentsModule } from "@/components/investments/investments-client";
import { PremiumGate } from "@/components/billing/premium-gate";
import { getSession } from "@/lib/auth";
import { getEntitlements } from "@/lib/billing";
import { getInvestmentsData } from "@/lib/investments";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inversiones — Money Path",
};

export default async function InversionesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const entitlements = await getEntitlements(session.user.id);
  if (!entitlements.has("inversiones")) {
    return (
      <PageShell navId="inversiones">
        <PremiumGate feature="inversiones" entitlements={entitlements} />
      </PageShell>
    );
  }

  const data = await getInvestmentsData(session.user.id);
  if (!data) redirect("/onboarding");

  return (
    <PageShell navId="inversiones" active>
      <InvestmentsModule data={data} />
    </PageShell>
  );
}

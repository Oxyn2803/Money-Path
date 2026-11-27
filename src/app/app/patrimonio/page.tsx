import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { PatrimonioModule } from "@/components/patrimonio/patrimonio-client";
import { PremiumGate } from "@/components/billing/premium-gate";
import { getSession } from "@/lib/auth";
import { getEntitlements } from "@/lib/billing";
import { getPatrimonioData } from "@/lib/patrimonio";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Patrimonio — Money Path",
};

export default async function PatrimonioPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const entitlements = await getEntitlements(session.user.id);
  if (!entitlements.has("patrimonio_completo")) {
    return (
      <PageShell navId="patrimonio">
        <PremiumGate feature="patrimonio_completo" entitlements={entitlements} />
      </PageShell>
    );
  }

  const data = await getPatrimonioData(session.user.id);
  if (!data) redirect("/onboarding");

  return (
    <PageShell navId="patrimonio" active>
      <PatrimonioModule data={data} />
    </PageShell>
  );
}

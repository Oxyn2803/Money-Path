import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { FondoClient } from "@/components/fondo/fondo-client";
import { PremiumGate } from "@/components/billing/premium-gate";
import { getSession } from "@/lib/auth";
import { getEntitlements } from "@/lib/billing";
import { getFondoData } from "@/lib/fondo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fondo de emergencia — Money Path",
};

export default async function FondoPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const entitlements = await getEntitlements(session.user.id);
  if (!entitlements.has("fondo")) {
    return (
      <PageShell navId="fondo">
        <PremiumGate feature="fondo" entitlements={entitlements} />
      </PageShell>
    );
  }

  const data = await getFondoData(session.user.id);
  if (!data) redirect("/onboarding");

  return (
    <PageShell navId="fondo" active>
      <FondoClient data={data} />
    </PageShell>
  );
}

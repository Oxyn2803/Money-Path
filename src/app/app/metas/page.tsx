import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { GoalsModule } from "@/components/goals/goals-client";
import { GoalLimitNotice } from "@/components/billing/premium-gate";
import { getSession } from "@/lib/auth";
import { getEntitlements } from "@/lib/billing";
import { getGoalsData } from "@/lib/goals";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Metas — Money Path",
};

export default async function MetasPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [data, entitlements] = await Promise.all([
    getGoalsData(session.user.id),
    getEntitlements(session.user.id),
  ]);
  if (!data) redirect("/onboarding");

  // Plan Free: hasta 3 metas activas (el bloqueo real también está en la API).
  const atLimit =
    entitlements.goalsLimit !== null && data.goals.length >= entitlements.goalsLimit;

  return (
    <PageShell navId="metas" active>
      {atLimit ? <GoalLimitNotice limit={entitlements.goalsLimit ?? 0} /> : null}
      <GoalsModule data={data} />
    </PageShell>
  );
}

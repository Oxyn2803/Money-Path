import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { PageShell } from "@/components/app/page-shell";
import { CalculatorsModule } from "@/components/calculadoras/calculators-client";
import type { CurrencyCode } from "@/config/locales";
import { db } from "@/db";
import { financialProfiles } from "@/db/schema";
import { PremiumGate } from "@/components/billing/premium-gate";
import { getSession } from "@/lib/auth";
import { getEntitlements } from "@/lib/billing";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Calculadoras — Money Path",
};

export default async function CalculadorasPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const entitlements = await getEntitlements(session.user.id);
  if (!entitlements.has("calculadoras")) {
    return (
      <PageShell navId="calculadoras">
        <PremiumGate feature="calculadoras" entitlements={entitlements} />
      </PageShell>
    );
  }

  const profileRows = await db
    .select({
      baseCurrency: financialProfiles.baseCurrency,
      onboardingCompletedAt: financialProfiles.onboardingCompletedAt,
    })
    .from(financialProfiles)
    .where(eq(financialProfiles.userId, session.user.id))
    .limit(1);
  if (profileRows.length === 0 || !profileRows[0].onboardingCompletedAt) {
    redirect("/onboarding");
  }
  const currency = profileRows[0].baseCurrency as CurrencyCode;

  return (
    <PageShell navId="calculadoras" active>
      <CalculatorsModule currency={currency} />
    </PageShell>
  );
}

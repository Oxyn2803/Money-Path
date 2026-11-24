import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { AcademyModule } from "@/components/academia/academy-client";
import { getSession } from "@/lib/auth";
import { getAcademyData } from "@/lib/academy";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Academia — Money Path",
};

export default async function AcademiaPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getAcademyData(session.user.id);
  if (!data) redirect("/onboarding");

  return (
    <PageShell navId="academia" active>
      <AcademyModule data={data} />
    </PageShell>
  );
}

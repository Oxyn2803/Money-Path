import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { SettingsModule } from "@/components/settings/settings-client";
import { getSession } from "@/lib/auth";
import { getSettingsData } from "@/lib/settings-page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Configuración — Money Path",
};

export default async function ConfiguracionPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getSettingsData(session.user.id);
  if (!data) redirect("/onboarding");

  return (
    <PageShell navId="configuracion" active>
      <SettingsModule data={data} email={session.user.email} />
    </PageShell>
  );
}

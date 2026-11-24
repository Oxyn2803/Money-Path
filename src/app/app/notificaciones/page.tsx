import { redirect } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { NotificationsCenter } from "@/components/notificacoes/notifications-client";
import { getSession } from "@/lib/auth";
import { generateNotifications, getNotificationsData } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notificaciones — Money Path",
};

export default async function NotificacionesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Genera avisos pendientes (idempotente, anti-duplicados, con preferencias).
  await generateNotifications(session.user.id);
  const data = await getNotificationsData(session.user.id);

  return (
    <PageShell navId="notificaciones" active>
      <NotificationsCenter data={data} />
    </PageShell>
  );
}

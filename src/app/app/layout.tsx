import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { MobileNav } from "@/components/app/mobile-nav";
import { SessionGate } from "@/components/app/session-gate";
import { Sidebar } from "@/components/app/sidebar";
import { Wordmark } from "@/components/wordmark";
import { getSession } from "@/lib/auth";
import { isOnboardingCompleted } from "@/lib/onboarding";
import { getTheme } from "@/lib/settings-page";

/**
 * Layout del aplicativo Money Path.
 * - Desktop: sidebar fija + contenido principal.
 * - Mobile: barra superior compacta + bottom navigation.
 * - Protección: si el servidor ve cookie de sesión, el contenido se renderiza
 *   directo; si no (p. ej. cookies de terceros bloqueadas en el preview
 *   embebido), `SessionGate` resuelve la sesión por cliente —cookie o token
 *   Bearer— y redirige a `/login` cuando no existe. Las consultas de datos
 *   siempre se filtran por el usuario de la sesión en el servidor.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  // Sin onboarding completo, la primera parada es el diagnóstico inicial.
  let theme: "light" | "dark" = "light";
  if (session) {
    const [completed, storedTheme] = await Promise.all([
      isOnboardingCompleted(session.user.id),
      getTheme(session.user.id),
    ]);
    if (!completed) {
      redirect("/onboarding");
    }
    theme = storedTheme;
  }

  return (
    <div className="min-h-dvh bg-background" data-theme={theme} data-color-scheme={theme}>
      <Sidebar />

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between px-5 py-3">
            <Link href="/app" aria-label="Money Path — Inicio">
              <Wordmark />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-5 pb-28 pt-6 lg:pb-14 lg:pt-8">
          {session ? children : <SessionGate>{children}</SessionGate>}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

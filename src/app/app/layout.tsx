import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { MobileNav } from "@/components/app/mobile-nav";

/**
 * Área autenticada (Etapa 27 — producción): fuera del índice de buscadores.
 * El contenido financiero de cada usuario nunca debe aparecer en resultados
 * de búsqueda; solo el sitio público es indexable (ver `robots.ts`).
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { SessionGate } from "@/components/app/session-gate";
import { Sidebar } from "@/components/app/sidebar";
import { Wordmark } from "@/components/wordmark";
import { getEntitlements } from "@/lib/billing";
import { getSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
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
  const dict = await getDictionary();
  const session = await getSession();

  // Sin onboarding completo, la primera parada es el diagnóstico inicial.
  let theme: "light" | "dark" = "light";
  let plan: "free" | "pro" = "free";
  if (session) {
    const [completed, storedTheme, entitlements] = await Promise.all([
      isOnboardingCompleted(session.user.id),
      getTheme(session.user.id),
      getEntitlements(session.user.id),
    ]);
    if (!completed) {
      redirect("/onboarding");
    }
    theme = storedTheme;
    plan = entitlements.plan;
  }

  return (
    <div className="min-h-dvh bg-background transition-colors duration-300" data-theme={theme} data-color-scheme={theme}>
      <Sidebar />

      <div className="lg:pl-[264px]">
        {/*
         * Cabeçalho mobile (Etapa 24): além do wordmark, expõe o plano atual e
         * um atalho direto para Planes y suscripción. Antes o único caminho era
         * abrir o menu "Más" — duas interações para ver o próprio plano.
         */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <Link href="/app" aria-label="Money Path — Inicio" className="shrink-0">
              <Wordmark />
            </Link>
            <Link
              href="/app/suscripcion"
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-[11px] font-bold text-muted transition-colors hover:text-text"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  plan === "pro" ? "bg-accent-500" : "bg-faint"
                }`}
                aria-hidden
              />
              {plan === "pro" ? dict.billing.common.pro : dict.billing.common.free}
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

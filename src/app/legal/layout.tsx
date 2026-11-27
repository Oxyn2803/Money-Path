import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/wordmark";

export const metadata = {
  title: "Legal — Money Path",
  robots: { index: false, follow: true },
};

/**
 * Shell de las páginas legales (Etapa 27 — producción).
 * Comparten navegación mínima; quedan fuera del índice de buscadores porque
 * son documentos de apoyo, no contenido de captación.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link href="/" aria-label="Money Path — Inicio">
            <Wordmark />
          </Link>
          <nav className="flex items-center gap-1 text-xs font-bold">
            <Link
              href="/legal/privacidad"
              className="rounded-lg px-3 py-2 text-muted transition-colors hover:bg-background hover:text-text"
            >
              Privacidad
            </Link>
            <Link
              href="/legal/terminos"
              className="rounded-lg px-3 py-2 text-muted transition-colors hover:bg-background hover:text-text"
            >
              Términos
            </Link>
            <Link
              href="/"
              className="rounded-lg bg-primary-700 px-3 py-2 text-primary-50 transition-colors hover:bg-primary-hover"
            >
              Inicio
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-10">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-3xl px-5 py-6 text-xs text-faint">
          Money Path · Documentos legales · Última actualización: noviembre 2026
        </div>
      </footer>
    </div>
  );
}

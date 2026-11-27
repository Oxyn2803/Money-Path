import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/wordmark";
import { getDictionary } from "@/lib/i18n";

/** Layout das páginas públicas de autenticación — Etapa 29 (dark style). */
export default async function AuthLayout({ children }: { children: ReactNode }) {
  const dict = await getDictionary();

  return (
    <div
      className="grid min-h-dvh place-items-center px-5 py-10"
      style={{ background: "#101210" }}
    >
      {/* Glow verde atrás do card */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(164,247,61,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo centrada */}
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Money Path">
            <Wordmark size="lg" />
          </Link>
        </div>

        {/* Card de autenticação */}
        <main
          style={{
            background: "#1a1f1a",
            border: "1px solid #2a2f2a",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
          }}
        >
          {children}
        </main>

        <p className="mt-6 text-center">
          <Link
            href="/"
            style={{ color: "#5a5a5a", fontSize: "0.8rem", fontWeight: 600 }}
            className="transition-colors hover:text-white"
          >
            {dict.auth.backToSite}
          </Link>
        </p>
      </div>
    </div>
  );
}

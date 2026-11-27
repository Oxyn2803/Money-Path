import Link from "next/link";
import { Suspense } from "react";
import {
  FoundationStatus,
  FoundationStatusSkeleton,
} from "@/components/foundation-status";
import { ModuleMap } from "@/components/module-map";
import { Roadmap } from "@/components/roadmap";
import { Wordmark } from "@/components/wordmark";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dict = await getDictionary();
  const year = new Date().getFullYear();

  return (
    /* Landing em dark mode conforme referência TrustData */
    <div className="min-h-screen" style={{ background: "#101210", color: "#f0f0f0" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid #2a2f2a", background: "rgba(16,18,16,0.95)", backdropFilter: "blur(12px)" }} className="sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Wordmark />
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <Link
              href="/precios"
              style={{ color: "#9a9a9a" }}
              className="px-3 py-1.5 transition-colors hover:text-white"
            >
              {dict.billing.nav.site}
            </Link>
            <Link
              href="/design"
              style={{ color: "#9a9a9a" }}
              className="px-3 py-1.5 transition-colors hover:text-white"
            >
              Design
            </Link>
            <Link
              href="/app"
              style={{
                background: "#a4f73d",
                color: "#101210",
                borderRadius: "8px",
                padding: "8px 18px",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
              className="transition-opacity hover:opacity-90"
            >
              {dict.nav.items.inicio} »
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        className="mp-hero-glow relative overflow-hidden"
        style={{ minHeight: "85vh", display: "flex", alignItems: "center" }}
      >
        {/* Glow radial verde no fundo */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 50% at 50% 65%, rgba(164,247,61,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center">
          {/* Kicker badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ border: "1px solid #2a2f2a", background: "rgba(42,47,42,0.6)" }}>
            <span style={{ color: "#a4f73d", fontSize: "14px" }}>◈</span>
            <span style={{ color: "#9a9a9a", fontSize: "0.8rem", fontWeight: 500 }}>
              {dict.hero.kicker}
            </span>
          </div>

          {/* Título hero — alternando branco e verde-lima como na referência */}
          <h1
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ color: "#ffffff" }}>
              {dict.meta.name} —{" "}
            </span>
            <span style={{ color: "#a4f73d" }}>
              {dict.meta.tagline.split(".")[0]}.
            </span>
          </h1>

          <p style={{ color: "#9a9a9a", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto 2.5rem", lineHeight: 1.65 }}>
            {dict.hero.intro}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              style={{
                background: "#a4f73d",
                color: "#101210",
                borderRadius: "10px",
                padding: "13px 28px",
                fontWeight: 700,
                fontSize: "0.95rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
              className="transition-opacity hover:opacity-90"
            >
              {dict.auth.register.submit}
            </Link>
            <Link
              href="/precios"
              style={{
                background: "transparent",
                color: "#f0f0f0",
                borderRadius: "10px",
                padding: "13px 28px",
                fontWeight: 600,
                fontSize: "0.95rem",
                border: "1px solid #3a3f3a",
              }}
              className="transition-colors hover:border-[#a4f73d]/40"
            >
              {dict.billing.common.viewPlans}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Cards de features (como referência TrustData) ────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Card 1 */}
          <div
            style={{
              background: "#1a1f1a",
              border: "1px solid #2a2f2a",
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <div style={{ color: "#a4f73d", marginBottom: "12px", fontSize: "1.5rem" }}>◈</div>
            <h3 style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.05rem", marginBottom: "8px" }}>
              {dict.modules.items.dashboard.name}
            </h3>
            <p style={{ color: "#6a6a6a", fontSize: "0.875rem", lineHeight: 1.6 }}>
              {dict.modules.items.dashboard.desc}
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: "#1a1f1a",
              border: "1px solid #2a2f2a",
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <div style={{ color: "#a4f73d", marginBottom: "12px", fontSize: "1.5rem" }}>📊</div>
            <h3 style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.05rem", marginBottom: "8px" }}>
              {dict.modules.items.presupuesto.name}
            </h3>
            <p style={{ color: "#6a6a6a", fontSize: "0.875rem", lineHeight: 1.6 }}>
              {dict.modules.items.presupuesto.desc}
            </p>
          </div>

          {/* Card 3 — destaque verde-lima */}
          <div
            style={{
              background: "#a4f73d",
              border: "none",
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <div style={{ color: "#101210", marginBottom: "12px", fontSize: "1.5rem" }}>⚡</div>
            <h3 style={{ color: "#101210", fontWeight: 700, fontSize: "1.05rem", marginBottom: "8px" }}>
              {dict.differentiators.path.name}
            </h3>
            <p style={{ color: "#2a3a0a", fontSize: "0.875rem", lineHeight: 1.6 }}>
              {dict.differentiators.path.desc}
            </p>
          </div>
        </div>
      </section>

      {/* ── Título de seção: "Seu dinheiro. Seu plano." ─────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 text-center">
        <h2
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "#ffffff" }}>{dict.differentiators.title} </span>
          <span style={{ color: "#a4f73d" }}>{dict.differentiators.subtitle}</span>
        </h2>
      </section>

      {/* ── Módulos ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-5 pb-16">
        <ModuleMap />
      </div>

      {/* ── Roadmap ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-5 pb-16">
        <Roadmap />
      </div>

      {/* ── Status técnico ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-5 pb-16">
        <Suspense fallback={<FoundationStatusSkeleton />}>
          <FoundationStatus />
        </Suspense>
      </div>

      {/* ── CTA final ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div
          style={{
            background: "linear-gradient(135deg, #1a2a0a 0%, #1a1f1a 100%)",
            border: "1px solid #3a4a1a",
            borderRadius: "20px",
            padding: "60px 40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            <span style={{ color: "#a4f73d" }}>{dict.meta.name} </span>
            <span style={{ color: "#ffffff" }}>— {dict.meta.tagline}</span>
          </h2>
          <p style={{ color: "#9a9a9a", maxWidth: "520px", margin: "0 auto 32px", lineHeight: 1.65 }}>
            {dict.meta.description}
          </p>
          <Link
            href="/register"
            style={{
              background: "#a4f73d",
              color: "#101210",
              borderRadius: "50px",
              padding: "14px 32px",
              fontWeight: 700,
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
            className="transition-opacity hover:opacity-90"
          >
            <span>→</span>
            {dict.auth.register.submit}
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #2a2f2a" }}>
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Coluna: logo + descrição */}
            <div>
              <Wordmark className="mb-4" />
              <p style={{ color: "#6a6a6a", fontSize: "0.8rem", lineHeight: 1.65 }}>
                {dict.footer.principle}
              </p>
            </div>

            {/* Coluna: menu */}
            <div>
              <p style={{ color: "#9a9a9a", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>
                Menu
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { href: "/app", label: dict.nav.items.inicio },
                  { href: "/precios", label: dict.billing.nav.site },
                  { href: "/legal/privacidad", label: dict.footer.privacy },
                  { href: "/legal/terminos", label: dict.footer.terms },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ color: "#6a6a6a", fontSize: "0.875rem" }}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Coluna: módulos */}
            <div>
              <p style={{ color: "#9a9a9a", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>
                {dict.modules.title}
              </p>
              <div className="flex flex-col gap-2">
                {[
                  dict.modules.items.presupuesto.name,
                  dict.modules.items.deudas.name,
                  dict.modules.items.metas.name,
                  dict.modules.items.inversiones.name,
                ].map((name) => (
                  <span key={name} style={{ color: "#6a6a6a", fontSize: "0.875rem" }}>
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Coluna: diferenciais */}
            <div>
              <p style={{ color: "#9a9a9a", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>
                {dict.differentiators.title}
              </p>
              <div className="flex flex-col gap-2">
                <span style={{ color: "#a4f73d", fontSize: "0.875rem", fontWeight: 600 }}>
                  {dict.differentiators.path.name}
                </span>
                <span style={{ color: "#a4f73d", fontSize: "0.875rem", fontWeight: 600 }}>
                  {dict.differentiators.ai.name}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{ borderTop: "1px solid #2a2f2a", marginTop: "40px", paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
          >
            <span style={{ color: "#5a5a5a", fontSize: "0.8rem" }}>
              © {year} Money Path · {dict.footer.builtFor}
            </span>
            <span style={{ color: "#5a5a5a", fontSize: "0.8rem" }}>
              {dict.footer.stageNote}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

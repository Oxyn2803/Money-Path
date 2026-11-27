/**
 * Wordmark de Money Path — Etapa 29 (redesign visual).
 *
 * Logo: duas chevrons diagonais sobrepostas formando um "M" estilizado,
 * com gradiente verde-lima (#a4f73d → branco translúcido), conforme a
 * referência "Money Path logo.png". Texto "Money Path" em branco/escuro
 * dependendo do tema.
 *
 * Fiel à referência: ícone à esquerda + texto "Money Path" ao lado.
 */
export function Wordmark({ className = "", size = "default" }: { className?: string; size?: "default" | "sm" | "lg" }) {
  const iconSize = size === "sm" ? 22 : size === "lg" ? 36 : 28;
  const textClass = size === "sm"
    ? "text-sm font-semibold tracking-tight"
    : size === "lg"
    ? "text-xl font-bold tracking-tight"
    : "text-base font-semibold tracking-tight";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Ícone: dupla-chevron / "M" estilizado com gradiente verde-lima */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        role="img"
        aria-label="Money Path logo"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="mp-grad-1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a4f73d" stopOpacity="1" />
            <stop offset="100%" stopColor="#c8f080" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="mp-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Chevron esquerda (atrás) — translúcido */}
        <path
          d="M4 24 L12 8 L16 15 L10 24 Z"
          fill="url(#mp-grad-2)"
          opacity="0.8"
        />
        <path
          d="M10 24 L16 15 L20 22 L14 24 Z"
          fill="url(#mp-grad-2)"
          opacity="0.5"
        />

        {/* Chevron direita (frente) — verde-lima com gradiente */}
        <path
          d="M12 24 L20 8 L24 15 L18 24 Z"
          fill="url(#mp-grad-1)"
        />
        <path
          d="M18 24 L24 15 L28 22 L22 24 Z"
          fill="url(#mp-grad-1)"
          opacity="0.7"
        />

        {/* Ponto de acento no topo */}
        <circle cx="20" cy="8" r="2.5" fill="#a4f73d" opacity="0.9" />
      </svg>

      {/* Texto: branco no dark, escuro no light */}
      <span
        className={`${textClass} text-text`}
        style={{ fontFamily: "var(--font-inter), var(--font-manrope), sans-serif" }}
      >
        Money&nbsp;Path
      </span>
    </span>
  );
}

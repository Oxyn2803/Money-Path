export interface ProStampProps {
  size?: number;
  className?: string;
}

/**
 * Sello PRO (Etapa 22) — elemento vectorial de la identidad de planes.
 * Tinta cobre sobre papel: se estampa una sola vez, con ligera rotación,
 * igual que un sello de goma sobre un estado de cuenta impreso.
 */
export function ProStamp({ size = 88, className = "" }: ProStampProps) {
  const ticks = Array.from({ length: 36 }, (_, index) => {
    const angle = (index * 10 * Math.PI) / 180;
    const outer = 55;
    const inner = index % 3 === 0 ? 49 : 52;
    return {
      x1: 60 + Math.cos(angle) * inner,
      y1: 60 + Math.sin(angle) * inner,
      x2: 60 + Math.cos(angle) * outer,
      y2: 60 + Math.sin(angle) * outer,
    };
  });

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Sello Money Path Pro"
    >
      <g stroke="currentColor" fill="none" strokeLinecap="round">
        <circle cx="60" cy="60" r="56" strokeWidth="1.5" opacity="0.55" />
        <circle cx="60" cy="60" r="45" strokeWidth="3" />
        <circle cx="60" cy="60" r="38" strokeWidth="1" opacity="0.75" />
        {ticks.map((tick, index) => (
          <line
            key={index}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            strokeWidth="1.4"
            opacity="0.65"
          />
        ))}
      </g>
      <text
        x="60"
        y="57"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-display)"
        fontSize="23"
        fontWeight="700"
        letterSpacing="1.5"
      >
        PRO
      </text>
      <text
        x="60"
        y="73"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-sans)"
        fontSize="7"
        fontWeight="700"
        letterSpacing="2.4"
        opacity="0.9"
      >
        MONEY PATH
      </text>
      <line x1="40" y1="80" x2="80" y2="80" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
    </svg>
  );
}

import { ImageResponse } from "next/og";
import { siteDescription, siteName } from "@/lib/site";

/**
 * Imagen Open Graph (Etapa 27 — producción).
 *
 * Se genera en el servidor con `next/og` en lugar de subir un PNG: el texto
 * se renderiza nítido en cualquier tamaño, no hay que mantener un archivo
 * desactualizado y se usa la misma tipografía/identidad que el producto.
 *
 * 1200×630 es el tamaño que usan Facebook, LinkedIn, Slack y WhatsApp.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteName} — Tu dinero. Tu plan. Tu patrimonio.`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#14656d",
          backgroundImage:
            "radial-gradient(circle at 82% 18%, rgba(226,173,128,0.22), transparent 42%)",
          padding: "72px 80px",
          color: "#fcfbf8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: "#0a333a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                border: "5px solid #e2ad80",
                borderRightColor: "transparent",
                transform: "rotate(-45deg)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            <div>{siteName}</div>
            <div style={{ color: "#e2ad80" }}>™</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            <div>Tu dinero. Tu plan.</div>
            <div style={{ color: "#e2ad80" }}>Tu patrimonio.</div>
          </div>
          <div style={{ fontSize: 30, color: "#aed3d6", maxWidth: 860, lineHeight: 1.4 }}>
            {siteDescription}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div
              key={index}
              style={{
                width: index === 8 ? 22 : 12,
                height: index === 8 ? 22 : 12,
                borderRadius: 999,
                backgroundColor: index === 8 ? "#c06e33" : "#e2ad80",
                opacity: index === 8 ? 1 : 0.55,
              }}
            />
          ))}
          <div style={{ fontSize: 22, color: "#7db6bc", marginLeft: 16 }}>
            Planificación financiera personal · México
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

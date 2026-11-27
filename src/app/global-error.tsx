"use client";

/**
 * Boundary global (Etapa 27 — producción).
 *
 * Cubre errores fuera de un layout de ruta (p. ej. el layout raíz). Es
 * autónomo a propósito: no depende de diccionarios, tokens ni proveedores
 * externos, para que siempre pueda renderizar algo aunque el fallo sea en
 * la carga inicial.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f4f3ee",
          color: "#16262b",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div
          role="alert"
          style={{
            maxWidth: "28rem",
            width: "100%",
            background: "#fcfbf8",
            border: "1px solid #e4e1d5",
            borderRadius: "16px",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#a12f29", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Error inesperado
          </p>
          <h1 style={{ fontSize: "18px", margin: "12px 0 0" }}>
            No pudimos iniciar Money Path
          </h1>
          <p style={{ fontSize: "14px", color: "#54656b", lineHeight: 1.6, marginTop: "8px" }}>
            Ocurrió un problema al cargar la aplicación. Tus datos están a
            salvo: vuelve a intentarlo.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "20px",
              background: "#14656d",
              color: "#fcfbf8",
              border: 0,
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
          {error.digest ? (
            <p style={{ fontSize: "11px", color: "#7f8c90", marginTop: "16px", fontFamily: "monospace" }}>
              Ref: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}

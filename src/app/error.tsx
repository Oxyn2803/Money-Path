"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconRefresh, IconRoute } from "@/components/icons";

export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Boundary de errores de ruta (Etapa 27 — producción).
 *
 * Antes un error en tiempo de ejecución mostraba la página blanca de Next;
 * ahora el usuario ve qué pasó, puede reintentar y tiene una salida al
 * inicio. El mensaje técnico va solo al registro del servidor (`console.error`),
 * nunca a la interfaz: no se filtra stack trace ni detalle de base de datos.
 */
export default function RouteError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[app] Error de ruta:", error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-danger/25 bg-danger-soft/50 px-6 py-10 text-center shadow-card">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-danger text-white">
          <IconAlertTriangle size={26} />
        </span>
        <h1 className="mt-5 font-display text-lg font-semibold text-text">
          Algo salió mal al cargar esta sección
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          No se pudo completar la operación. Tus datos no se modificaron. Puedes
          reintentar o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={reset} iconLeft={<IconRefresh size={15} />}>
            Reintentar
          </Button>
          <a
            href="/app"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border-strong bg-surface px-4 text-sm font-semibold text-text transition-colors hover:bg-elevated"
          >
            Volver al inicio
          </a>
        </div>
        {error.digest ? (
          <p className="mt-4 font-mono text-[11px] text-faint">Ref: {error.digest}</p>
        ) : null}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-faint">
          <IconRoute size={12} />
          Money Path
        </p>
      </div>
    </div>
  );
}

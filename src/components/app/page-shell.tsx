import type { ReactNode } from "react";
import { MODULES } from "@/config/modules";
import { getNavItem, NAV_SECTIONS, type NavItemId } from "@/config/navigation";
import { getDictionary } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { NAV_ICONS } from "./nav-icons";
import { Breadcrumbs } from "./breadcrumbs";

export interface PageShellProps {
  navId: NavItemId;
  /** Oculta los breadcrumbs (p. ej. en Inicio, que es la raíz). */
  hideBreadcrumbs?: boolean;
  /** El módulo ya está implementado (badge "Módulo activo"). */
  active?: boolean;
  children?: ReactNode;
}

/**
 * Estructura base de todas las páginas del aplicativo:
 * breadcrumbs, encabezado con ícono/título/descripción y contenido.
 */
export async function PageShell({ navId, hideBreadcrumbs = false, active = false, children }: PageShellProps) {
  const dict = await getDictionary();
  const item = getNavItem(navId);
  const texts = dict.pages[navId as keyof typeof dict.pages] as {
    title: string;
    description: string;
  };
  const Icon = NAV_ICONS[navId];
  const section = NAV_SECTIONS.find((entry) => entry.id === item.section);
  const sectionLabel = section
    ? dict.nav.sections[section.id as keyof typeof dict.nav.sections]
    : "";

  return (
    <div className="flex flex-col gap-6">
      {!hideBreadcrumbs ? (
        <Breadcrumbs
          items={[
            { label: dict.pages.common.breadcrumbHome, href: "/app" },
            ...(sectionLabel ? [{ label: sectionLabel }] : []),
            { label: texts.title },
          ]}
        />
      ) : null}

      {/*
       * Cabecera de página (Etapa 25): jerarquía explícita — sección (dónde
       * estoy), título (qué página) y descripción (qué significa). El icono
       * lleva anillo para separarlo del contenido y el estado del módulo se
       * alinea a la línea base del título para leerse como metadato.
       */}
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex items-start gap-3.5">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
            style={{
              background: "rgba(164,247,61,0.10)",
              color: "#a4f73d",
              border: "1px solid rgba(164,247,61,0.2)",
            }}
          >
            <Icon size={20} />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-text">
              {texts.title}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
              {texts.description}
            </p>
          </div>
        </div>
        <Badge tone={active ? "success" : "primary"} dot>
          {active ? dict.pages.common.moduleActive : dict.pages.common.structureReady}
        </Badge>
      </header>

      {children}
    </div>
  );
}

/**
 * Página base de un módulo: estructura completa lista para recibir la
 * implementación de su etapa (estado vacío + espacio reservado).
 */
export async function ModulePage({ navId }: { navId: NavItemId }) {
  const dict = await getDictionary();
  const item = getNavItem(navId);
  const texts = dict.pages[navId as keyof typeof dict.pages] as { title: string };
  const Icon = NAV_ICONS[navId];
  const module = item.moduleRef
    ? MODULES.find((entry) => entry.id === item.moduleRef)
    : undefined;

  return (
    <PageShell navId={navId}>
      <EmptyState
        icon={<Icon size={20} />}
        title={dict.pages.common.emptyTitle}
        description={dict.pages.common.emptyDescription}
      />

      <div
        aria-label={`${dict.pages.common.reservedFor} ${texts.title}`}
        className="grid min-h-[280px] place-items-center rounded-2xl border-2 border-dashed border-border-strong bg-surface/70 p-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-display text-sm font-semibold text-faint">
            {dict.pages.common.reservedFor}
          </span>
          <span className="font-display text-lg font-bold text-text">
            {texts.title}
          </span>
          {module ? (
            <span className="text-xs text-faint">
              {dict.modules.items[module.id as keyof typeof dict.modules.items]?.name} ·{" "}
              {dict.modules.status[module.status]}
            </span>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}

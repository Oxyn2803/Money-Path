"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import {
  NAV_SECTIONS,
  getNavItemsBySection,
  type NavItemDef,
} from "@/config/navigation";
import { useDictionary } from "@/lib/i18n";
import { clearSessionToken, signOut, useSession } from "@/lib/auth-client";
import { NAV_ICONS } from "./nav-icons";
import { NotificationCount } from "./notification-count";

function isActive(pathname: string, item: NavItemDef): boolean {
  if (item.href === "/app") return pathname === "/app";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavEntry({ item, pathname }: { item: NavItemDef; pathname: string }) {
  const dict = useDictionary();
  const Icon = NAV_ICONS[item.id];
  const active = isActive(pathname, item);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted hover:bg-surface hover:text-text"
      }`}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute inset-y-1.5 left-0 w-0.5 rounded-full"
          style={{ background: "#a4f73d" }}
        />
      ) : null}
      <Icon
        size={17}
        className={active ? "" : "text-faint"}
        style={active ? { color: "#a4f73d" } : {}}
      />
      {dict.nav.items[item.id]}
      {item.id === "notificaciones" ? <NotificationCount /> : null}
    </Link>
  );
}

/** Sidebar fija de escritorio (≥ lg). */
export function Sidebar() {
  const dict = useDictionary();
  const pathname = usePathname();
  const session = useSession();

  function handleSignOut() {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          clearSessionToken();
          window.location.href = "/login";
        },
      },
    });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-border bg-surface lg:flex">
      {/* Logo */}
      <div className="border-b border-border/60 px-5 py-4">
        <Link href="/app" aria-label="Money Path — Inicio">
          <Wordmark />
        </Link>
      </div>

      {/* Navegação */}
      <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.id}>
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-faint">
                {dict.nav.sections[section.id]}
              </p>
              <div className="flex flex-col gap-0.5">
                {getNavItemsBySection(section.id).map((item) => (
                  <NavEntry key={item.id} item={item} pathname={pathname} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Rodapé da sidebar */}
      <div className="border-t border-border/60 px-3 py-3">
        {session.data?.user ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-background px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-text">
                {session.data.user.name}
              </p>
              <p className="truncate text-[10px] text-faint">
                {session.data.user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="shrink-0 rounded-lg px-2 py-1.5 text-[10px] font-bold text-danger transition-colors hover:bg-danger-soft"
            >
              {dict.auth.signOut}
            </button>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-2 px-1">
          <Link
            href="/"
            className="rounded-lg px-2 py-1.5 text-xs font-bold text-muted transition-colors hover:bg-background hover:text-text"
          >
            {dict.nav.links.site}
          </Link>
          <Link
            href="/design"
            className="rounded-lg px-2 py-1.5 text-xs font-bold text-muted transition-colors hover:bg-background hover:text-text"
          >
            {dict.nav.links.design}
          </Link>
        </div>
        <p className="mt-1.5 px-1 text-[10px] font-semibold text-faint">
          {dict.nav.stageNote}
        </p>
      </div>
    </aside>
  );
}

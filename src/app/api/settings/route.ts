import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { getAuth } from "@/lib/auth-server";
import { getDictionary } from "@/lib/i18n";
import {
  cancelDeletion,
  canChangeCurrency,
  clearAiHistory,
  resetAcademyProgress,
  requestDeletion,
  setBaseCurrency,
  setTheme,
  syncDisplayName,
  updateProfileFields,
  type ThemeId,
} from "@/lib/settings-page";
import { setVisibleIndicators, isIndicatorId, type IndicatorId } from "@/lib/dashboard";
import { setEnabledTypes, isNotificationType, NOTIFICATION_TYPES, type NotificationType } from "@/lib/notifications";

export const dynamic = "force-dynamic";

function fail(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

/**
 * Configuración (Etapa 21).
 * ops: name | profile | currency | theme | notifications | dashboard |
 *      clear-ai | reset-academy | deletion-request | deletion-cancel
 */
export async function POST(request: Request) {
  const dict = getDictionary();
  const session = await getSession();
  if (!session) return fail(dict.auth.errors.generic, 401);
  const userId = session.user.id;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail(dict.settings.common.error);
  }
  const op = body.op;
  const s = dict.settings;

  /* Nombre de usuario (vía Better Auth + sync) */
  if (op === "name") {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 80) return fail(s.profile.nameError);
    try {
      const auth = await getAuth();
      await auth.api.updateUser({ headers: await headers(), body: { name } });
      await syncDisplayName(userId, name);
      return NextResponse.json({ ok: true });
    } catch {
      return fail(s.common.error, 500);
    }
  }

  /* País e idioma */
  if (op === "profile") {
    const country = typeof body.country === "string" ? body.country : undefined;
    const language = typeof body.language === "string" ? body.language : undefined;
    const result = await updateProfileFields(userId, { country, language });
    if (!result.ok) return fail(s.common.error, 400);
    return NextResponse.json({ ok: true });
  }

  /* Moneda base con confirmación explícita cuando hay datos */
  if (op === "currency") {
    const currency = typeof body.currency === "string" ? body.currency : "";
    const gate = await canChangeCurrency(userId, currency);
    if (!gate.allowed) return fail(s.common.error);
    if (gate.needsConfirm && body.confirm !== true) {
      return NextResponse.json(
        { message: s.preferences.currencySection.blocked, needsConfirm: true },
        { status: 409 },
      );
    }
    await setBaseCurrency(userId, currency);
    return NextResponse.json({ ok: true });
  }

  /* Tema */
  if (op === "theme") {
    const theme = body.theme === "dark" ? "dark" : "light";
    await setTheme(userId, theme as ThemeId);
    return NextResponse.json({ ok: true });
  }

  /* Notificaciones (mismo almacenamiento del centro) */
  if (op === "notifications") {
    const enabled = body.enabled;
    if (!Array.isArray(enabled)) return fail(s.common.error);
    const valid = enabled.filter(
      (entry): entry is NotificationType => typeof entry === "string" && isNotificationType(entry),
    );
    // Vacío = todo activado por seguridad (el centro usa la misma regla).
    await setEnabledTypes(userId, valid.length > 0 ? valid : [...NOTIFICATION_TYPES]);
    return NextResponse.json({ ok: true });
  }

  /* Panel (mismo almacenamiento del dashboard) */
  if (op === "dashboard") {
    const visible = body.visible;
    if (!Array.isArray(visible) || visible.length === 0) {
      return fail(s.preferences.dashboardSection.minOne);
    }
    const valid = visible.filter(
      (entry): entry is IndicatorId => typeof entry === "string" && isIndicatorId(entry),
    );
    if (valid.length === 0) return fail(s.preferences.dashboardSection.minOne);
    await setVisibleIndicators(userId, valid);
    return NextResponse.json({ ok: true });
  }

  /* Privacidad */
  if (op === "clear-ai") {
    await clearAiHistory(userId);
    return NextResponse.json({ ok: true });
  }

  if (op === "reset-academy") {
    await resetAcademyProgress(userId);
    return NextResponse.json({ ok: true });
  }

  /* Cuenta: solicitud de exclusión (no elimina nada) */
  if (op === "deletion-request") {
    const word = typeof body.word === "string" ? body.word : "";
    if (word !== s.account.deletion.word) {
      return fail(s.account.deletion.typeToConfirm.replace("{word}", s.account.deletion.word), 400);
    }
    await requestDeletion(userId);
    return NextResponse.json({ ok: true });
  }

  if (op === "deletion-cancel") {
    await cancelDeletion(userId);
    return NextResponse.json({ ok: true });
  }

  return fail(s.common.error);
}

/** Preferencias actuales del usuario (solo lectura, para tests/herramientas). */
export async function GET() {
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  const rows = await db
    .select()
    .from(userSettings)
    .where(and(eq(userSettings.userId, session.user.id)));
  return NextResponse.json({ settings: rows.map((row) => ({ key: row.key, value: row.value })) });
}

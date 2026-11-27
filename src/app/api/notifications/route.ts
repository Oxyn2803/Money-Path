import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isUuid } from "@/lib/validation";
import { getDictionary } from "@/lib/i18n";
import {
  clearRead,
  generateNotifications,
  getNotificationsData,
  isNotificationType,
  markAllRead,
  markRead,
  NOTIFICATION_TYPES,
  setEnabledTypes,
  type NotificationType,
} from "@/lib/notifications";

export const dynamic = "force-dynamic";

/**
 * Centro de notificaciones (Etapa 20).
 * - GET: lista + contador + preferencias (sin generar; el centro genera
 *   al abrirse desde la página, respetando anti-duplicados).
 * - POST: read | readAll | clear | generate | preferences.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }
  const data = await getNotificationsData(session.user.id);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const dict = await getDictionary();
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: dict.auth.errors.generic }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { op?: unknown; id?: unknown; enabled?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: dict.auth.errors.generic }, { status: 400 });
  }
  const op = body.op;

  if (op === "read") {
    const id = typeof body.id === "string" ? body.id : "";
    if (!isUuid(id)) return NextResponse.json({ message: dict.auth.errors.generic }, { status: 400 });
    const ok = await markRead(userId, id);
    return ok
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ message: dict.auth.errors.generic }, { status: 404 });
  }

  if (op === "readAll") {
    const count = await markAllRead(userId);
    return NextResponse.json({ ok: true, count });
  }

  if (op === "clear") {
    const count = await clearRead(userId);
    return NextResponse.json({ ok: true, count });
  }

  if (op === "generate") {
    const created = await generateNotifications(userId);
    return NextResponse.json({ ok: true, created });
  }

  if (op === "preferences") {
    const enabled = body.enabled;
    if (!Array.isArray(enabled)) {
      return NextResponse.json({ message: dict.auth.errors.generic }, { status: 400 });
    }
    const valid = enabled.filter(
      (entry): entry is NotificationType =>
        typeof entry === "string" && isNotificationType(entry),
    );
    // Se desactivan todas, se mantiene al menos una para no dejar vacío.
    const final = valid.length > 0 ? valid : [...NOTIFICATION_TYPES];
    await setEnabledTypes(userId, final);
    return NextResponse.json({ ok: true, enabled: final });
  }

  return NextResponse.json({ message: dict.auth.errors.generic }, { status: 400 });
}

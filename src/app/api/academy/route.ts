import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { guardFeature } from "@/lib/billing";
import { getDictionary } from "@/lib/i18n";
import { setAcademyProgress } from "@/lib/academy";

export const dynamic = "force-dynamic";

/**
 * Academia (Etapa 19): marcar contenido como concluido o favorito.
 * `{ contentId, field: "completed" | "favorite", value: boolean }`
 */
export async function POST(request: Request) {
  const dict = await getDictionary();
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: dict.auth.errors.generic }, { status: 401 });
  }

  const { denied } = await guardFeature(session.user.id, "academia");
  if (denied) return denied;

  let body: { contentId?: unknown; field?: unknown; value?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: dict.auth.errors.generic }, { status: 400 });
  }

  const contentId = typeof body.contentId === "string" ? body.contentId : "";
  const field = body.field === "completed" || body.field === "favorite" ? body.field : null;
  const value = body.value === true;
  if (!contentId || !field) {
    return NextResponse.json({ message: dict.auth.errors.generic }, { status: 400 });
  }

  const ok = await setAcademyProgress(session.user.id, contentId, field, value);
  if (!ok) {
    return NextResponse.json({ message: dict.auth.errors.generic }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

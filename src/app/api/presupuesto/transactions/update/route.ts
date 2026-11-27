import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { expenses, futureReceipts, income } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { isUuid } from "@/lib/validation";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const OPERATIONS = ["markReceived", "markPaid", "cancel", "delete"] as const;
type Operation = (typeof OPERATIONS)[number];

/**
 * Operaciones sobre un movimiento existente (siempre del usuario de la
 * sesión): marcar recibido/pagado, cancelar o eliminar (borrado suave).
 */
export async function POST(request: Request) {
  const dict = await getDictionary();
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: dict.auth.errors.generic }, { status: 401 });
  }
  const userId = session.user.id;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: dict.presupuesto.form.errors.generic }, { status: 400 });
  }

  const table = body.table;
  const id = typeof body.id === "string" ? body.id : "";
  const op = body.op as Operation;
  if ((table !== "income" && table !== "expenses") || !isUuid(id) || !OPERATIONS.includes(op)) {
    return NextResponse.json({ message: dict.presupuesto.form.errors.generic }, { status: 400 });
  }

  const ownership =
    table === "income"
      ? and(eq(income.id, id), eq(income.userId, userId))
      : and(eq(expenses.id, id), eq(expenses.userId, userId));

  const now = new Date();

  /*
   * Etapa 28 (auditoría final): cada operación comprueba las filas afectadas
   * con `.returning()`. Antes respondía `ok: true` aunque el `WHERE` con
   * `user_id` no hubiera matcheado nada — es decir, un movimiento ajeno o
   * ya eliminado devolvía **éxito falso** (los datos nunca se modificaron,
   * porque el filtro de usuario siempre estuvo presente).
   *
   * Ahora responde 404 con el mismo código para "no existe" y "no es tuyo",
   * de modo que tampoco se revela si el identificador existe.
   */
  const notFound = () =>
    NextResponse.json({ message: dict.presupuesto.form.errors.notFound }, { status: 404 });

  if (op === "delete") {
    const updated =
      table === "income"
        ? await db
            .update(income)
            .set({ deletedAt: now })
            .where(ownership)
            .returning({ id: income.id })
        : await db
            .update(expenses)
            .set({ deletedAt: now })
            .where(ownership)
            .returning({ id: expenses.id });
    if (updated.length === 0) return notFound();
    return NextResponse.json({ ok: true });
  }

  if (table === "income") {
    if (op === "markReceived") {
      const updated = await db
        .update(income)
        .set({ status: "received" })
        .where(ownership)
        .returning({ id: income.id });
      if (updated.length === 0) return notFound();
      // Concretar el cobro futuro vinculado, si existe.
      await db
        .update(futureReceipts)
        .set({ status: "received" })
        .where(and(eq(futureReceipts.userId, userId), eq(futureReceipts.receivedIncomeId, id)));
      return NextResponse.json({ ok: true });
    }
    if (op === "cancel") {
      const updated = await db
        .update(income)
        .set({ status: "cancelled" })
        .where(ownership)
        .returning({ id: income.id });
      if (updated.length === 0) return notFound();
      return NextResponse.json({ ok: true });
    }
  } else {
    if (op === "markPaid") {
      const updated = await db
        .update(expenses)
        .set({ status: "paid" })
        .where(ownership)
        .returning({ id: expenses.id });
      if (updated.length === 0) return notFound();
      return NextResponse.json({ ok: true });
    }
    if (op === "cancel") {
      const updated = await db
        .update(expenses)
        .set({ status: "cancelled" })
        .where(ownership)
        .returning({ id: expenses.id });
      if (updated.length === 0) return notFound();
      return NextResponse.json({ ok: true });
    }
  }

  return NextResponse.json({ message: dict.presupuesto.form.errors.generic }, { status: 400 });
}

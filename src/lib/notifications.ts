/**
 * Notificaciones (Etapa 20) — SOLO SERVIDOR.
 *
 * Generación: solo aviso real, basado en datos existentes, idempotente
 * (cada aviso aparece una sola vez por referencia) y respetando las
 * preferencias del usuario. Se genera al abrir el centro (sin jobs ni
 * spam): "no enviar notificaciones excesivas".
 */

import { and, asc, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  debts,
  emergencyFunds,
  expenseCategories,
  expenses,
  financialProfiles,
  futureReceipts,
  goalContributions,
  goals,
  income,
  notifications,
  userSettings,
} from "@/db/schema";
import { getDictionary } from "@/lib/i18n";
import { formatMoney } from "@/lib/money";
import { minorOf } from "@/lib/reports";
import {
  NOTIFICATION_TYPES,
  isNotificationType,
  type NotificationType,
  type NotificationsData,
  type NotificationView,
} from "./notifications-shared";

export {
  isNotificationType,
  NOTIFICATION_TYPES,
  type NotificationType,
  type NotificationsData,
  type NotificationView,
} from "./notifications-shared";

const PREFS_KEY = "notifications.enabled";
const NEW_CAP_PER_RUN = 15;
const RECEIPT_WINDOW_DAYS = 7;
const DEADLINE_WINDOW_DAYS = 30;

function daysInWindow(windowDays: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + windowDays);
  return date.toISOString().slice(0, 10);
}

/* ── Preferencias ────────────────────────────────────────────────────── */

export async function getEnabledTypes(userId: string): Promise<NotificationType[]> {
  const rows = await db
    .select()
    .from(userSettings)
    .where(and(eq(userSettings.userId, userId), eq(userSettings.key, PREFS_KEY)))
    .limit(1);
  const stored = rows[0]?.value as { enabled?: unknown } | null;
  if (stored && Array.isArray(stored.enabled)) {
    const valid = stored.enabled.filter(
      (entry): entry is NotificationType => typeof entry === "string" && isNotificationType(entry),
    );
    if (valid.length > 0) return valid;
  }
  return [...NOTIFICATION_TYPES]; // por defecto todo activo
}

export async function setEnabledTypes(
  userId: string,
  enabled: NotificationType[],
): Promise<void> {
  const value = { enabled };
  await db
    .insert(userSettings)
    .values({ userId, key: PREFS_KEY, value })
    .onConflictDoUpdate({ target: [userSettings.userId, userSettings.key], set: { value } });
}

/* ── Consulta de claves existentes (anti-duplicados) ──────────────────── */

async function existingKeys(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ metadata: notifications.metadata })
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(500);
  const keys = new Set<string>();
  for (const row of rows) {
    const key = (row.metadata as { key?: string } | null)?.key;
    if (key) keys.add(key);
  }
  return keys;
}

interface PendingNotification {
  type: NotificationType;
  key: string;
  title: string;
  body: string;
}

/**
 * Construye los avisos pendientes a partir de datos reales.
 * Devuelve solo los que aún no existen y cuyo tipo está activado.
 */
export async function generateNotifications(userId: string): Promise<number> {
  const enabled = await getEnabledTypes(userId);
  const seen = await existingKeys(userId);
  const pending: PendingNotification[] = [];
  const dict = getDictionary();
  const items = dict.notifications.items;
  const push = (n: PendingNotification) => {
    if (enabled.includes(n.type) && !seen.has(n.key)) pending.push(n);
  };

  const profileRows = await db
    .select()
    .from(financialProfiles)
    .where(eq(financialProfiles.userId, userId))
    .limit(1);
  const profile = profileRows[0];
  if (!profile || !profile.onboardingCompletedAt) return 0;

  const currency = profile.baseCurrency;
  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10);
  const horizon = daysInWindow(RECEIPT_WINDOW_DAYS);
  const monthStart = `${todayIso.slice(0, 7)}-01`;

  /* 1) Receita futura: cobros próximos (7 días). */
  const receiptRows = await db
    .select({
      id: futureReceipts.id,
      description: futureReceipts.description,
      amount: futureReceipts.amount,
      expectedOn: futureReceipts.expectedOn,
    })
    .from(futureReceipts)
    .where(
      and(
        eq(futureReceipts.userId, userId),
        eq(futureReceipts.status, "pending"),
        isNull(futureReceipts.deletedAt),
        gte(futureReceipts.expectedOn, todayIso),
        sql`${futureReceipts.expectedOn} <= ${horizon}`,
      ),
    )
    .orderBy(asc(futureReceipts.expectedOn));
  for (const row of receiptRows) {
    push({
      type: "future_receipt",
      key: `future_receipt:${row.id}:${row.expectedOn}`,
      title: items.futureReceipt.title.replace("{name}", row.description),
      body: items.futureReceipt.body
        .replace("{amount}", formatAmount(minorOf(row.amount), currency))
        .replace("{date}", formatDate(row.expectedOn)),
    });
  }

  /* 2) Vencimento de deudas (próximos 7 días, por día de pago). */
  const debtRows = await db
    .select({ id: debts.id, name: debts.name, dueDay: debts.dueDay })
    .from(debts)
    .where(and(eq(debts.userId, userId), eq(debts.status, "active"), isNull(debts.deletedAt)));
  for (const row of debtRows) {
    if (!row.dueDay) continue;
    const dueDate = nextDueIso(row.dueDay, now);
    if (dueDate > horizon) continue;
    const days = daysBetween(todayIso, dueDate);
    push({
      type: "due_date",
      key: `debt:${row.id}:due:${dueDate.slice(0, 7)}`,
      title: items.dueDate.title.replace("{name}", row.name),
      body: items.dueDate.body
        .replace("{when}", whenLabel(days))
        .replace("{date}", formatDate(dueDate)),
    });
  }

  /* 3) Parcelas por vencer (7 días). */
  const cuotaRows = await db
    .select({
      id: expenses.id,
      description: expenses.description,
      occurredOn: expenses.occurredOn,
      number: expenses.installmentNumber,
      installmentId: expenses.installmentId,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        eq(expenses.status, "pending"),
        sql`${expenses.installmentId} IS NOT NULL`,
        isNull(expenses.deletedAt),
        gte(expenses.occurredOn, todayIso),
        sql`${expenses.occurredOn} <= ${horizon}`,
      ),
    )
    .orderBy(asc(expenses.occurredOn))
    .limit(10);
  // Total de cuotas por plan (una sola consulta).
  const planIds = Array.from(
    new Set(cuotaRows.map((row) => row.installmentId).filter((id): id is string => Boolean(id))),
  );
  const totalsByPlan = new Map<string, number>();
  if (planIds.length > 0) {
    const planCounts = await db
      .select({ installmentId: expenses.installmentId, count: sql<number>`count(*)::int` })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          isNull(expenses.deletedAt),
          sql`${expenses.installmentId} IS NOT NULL`,
          inArray(expenses.installmentId, planIds),
        ),
      )
      .groupBy(expenses.installmentId);
    for (const row of planCounts) {
      if (row.installmentId) totalsByPlan.set(row.installmentId, Number(row.count));
    }
  }
  for (const row of cuotaRows) {
    const total = row.installmentId ? (totalsByPlan.get(row.installmentId) ?? 0) : 0;
    push({
      type: "installment",
      key: `installment:${row.id}`,
      title: items.installment.title.replace("{name}", row.description),
      body: items.installment.body
        .replace("{n}", String(row.number ?? 1))
        .replace("{total}", String(total))
        .replace("{when}", whenLabel(daysBetween(todayIso, String(row.occurredOn))))
        .replace("{date}", formatDate(String(row.occurredOn))),
    });
  }

  /* 4) Metas: alcanzadas o con plazo próximo (30 días). */
  const goalRows = await db
    .select()
    .from(goals)
    .where(and(eq(goals.userId, userId), eq(goals.status, "active"), isNull(goals.deletedAt)))
    .orderBy(asc(goals.createdAt));
  for (const goal of goalRows) {
    const target = minorOf(goal.targetAmount);
    const current = minorOf(goal.currentAmount);
    if (target > 0 && current >= target) {
      push({
        type: "goal",
        key: `goal:${goal.id}:achieved`,
        title: items.goalAchieved.title,
        body: items.goalAchieved.body.replace("{name}", goal.name),
      });
      continue;
    }
    if (goal.targetDate) {
      const date = String(goal.targetDate);
      const days = daysBetween(todayIso, date);
      if (days >= 0 && days <= DEADLINE_WINDOW_DAYS) {
        push({
          type: "goal",
          key: `goal:${goal.id}:deadline:${date}`,
          title: items.goalDeadline.title.replace("{name}", goal.name),
          body: items.goalDeadline.body.replace("{days}", String(days)).replace("{date}", formatDate(date)),
        });
      }
    }
  }

  /* 5) Deudas liquidadas. */
  const paidDebts = await db
    .select({ id: debts.id, name: debts.name })
    .from(debts)
    .where(and(eq(debts.userId, userId), eq(debts.status, "paid_off"), isNull(debts.deletedAt)))
    .limit(5);
  for (const row of paidDebts) {
    push({
      type: "debt",
      key: `debt:${row.id}:paid`,
      title: items.debtPaidOff.title,
      body: items.debtPaidOff.body.replace("{name}", row.name),
    });
  }

  /* 6) Orçamento: gastos del mes > ingresos del mes. */
  const [monthIncome, monthExpenses] = await Promise.all([
    db
      .select({ total: sql<string>`coalesce(sum(${income.amount}), 0)` })
      .from(income)
      .where(
        and(
          eq(income.userId, userId),
          eq(income.currency, currency),
          eq(income.status, "received"),
          isNull(income.deletedAt),
          gte(income.occurredOn, monthStart),
        ),
      ),
    db
      .select({ total: sql<string>`coalesce(sum(${expenses.amount}), 0)` })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          eq(expenses.currency, currency),
          sql`(${expenses.status} = 'paid' OR ${expenses.status} = 'pending')`,
          isNull(expenses.deletedAt),
          gte(expenses.occurredOn, monthStart),
        ),
      ),
  ]);
  const incomeTotal = minorOf(monthIncome[0]?.total);
  const expensesTotal = minorOf(monthExpenses[0]?.total);
  if (incomeTotal > 0 && expensesTotal > incomeTotal) {
    push({
      type: "budget",
      key: `budget:${todayIso.slice(0, 7)}`,
      title: items.budgetOver.title,
      body: items.budgetOver.body
        .replace("{expenses}", formatAmount(expensesTotal, currency))
        .replace("{income}", formatAmount(incomeTotal, currency)),
    });
  }

  /* 7) Fondo de emergencia: completo o bajo. */
  const fundRows = await db
    .select()
    .from(emergencyFunds)
    .where(and(eq(emergencyFunds.userId, userId), isNull(emergencyFunds.deletedAt)))
    .orderBy(desc(emergencyFunds.createdAt))
    .limit(1);
  const fund = fundRows[0];
  if (fund) {
    const current = minorOf(fund.currentAmount);
    const target = minorOf(fund.targetAmount);
    if (target > 0 && current >= target) {
      push({
        type: "emergency_fund",
        key: `fund:complete:${todayIso.slice(0, 7)}`,
        title: items.fundComplete.title,
        body: items.fundComplete.body.replace("{amount}", formatAmount(target, currency)),
      });
    } else if (target > 0) {
      const essential = minorOf(profile.monthlyFixedExpenses);
      if (essential > 0) {
        const months = current / essential;
        if (months < 2) {
          push({
            type: "emergency_fund",
            key: `fund:low:${todayIso.slice(0, 7)}`,
            title: items.fundLow.title,
            body: items.fundLow.body.replace("{months}", months.toFixed(1)),
          });
        }
      }
    }
  }

  /* 8) Insight: mayor subida de gasto por categoría vs mes anterior (≥10%). */
  const prevMonthStart = (() => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    return d.toISOString().slice(0, 10);
  })();
  const [catCurrent, catPrevious] = await Promise.all([
    db
      .select({ name: expenseCategories.name, total: sql<string>`coalesce(sum(${expenses.amount}), 0)` })
      .from(expenses)
      .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
      .where(
        and(
          eq(expenses.userId, userId),
          eq(expenses.currency, currency),
          sql`(${expenses.status} = 'paid' OR ${expenses.status} = 'pending')`,
          isNull(expenses.deletedAt),
          gte(expenses.occurredOn, monthStart),
        ),
      )
      .groupBy(expenses.categoryId, expenseCategories.name),
    db
      .select({ name: expenseCategories.name, total: sql<string>`coalesce(sum(${expenses.amount}), 0)` })
      .from(expenses)
      .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
      .where(
        and(
          eq(expenses.userId, userId),
          eq(expenses.currency, currency),
          sql`(${expenses.status} = 'paid' OR ${expenses.status} = 'pending')`,
          isNull(expenses.deletedAt),
          gte(expenses.occurredOn, prevMonthStart),
          sql`${expenses.occurredOn} < ${monthStart}`,
        ),
      )
      .groupBy(expenses.categoryId, expenseCategories.name),
  ]);
  const prevByName = new Map(catPrevious.map((r) => [r.name ?? "", minorOf(r.total)]));
  let bestIncrease: { name: string; pct: number } | null = null;
  for (const row of catCurrent) {
    const previous = prevByName.get(row.name ?? "") ?? 0;
    const current = minorOf(row.total);
    if (previous < 50000 || current <= previous) continue;
    const pct = ((current - previous) / previous) * 100;
    if (pct >= 10 && (!bestIncrease || pct > bestIncrease.pct)) {
      bestIncrease = { name: row.name ?? "gastos", pct };
    }
  }
  if (bestIncrease) {
    push({
      type: "insight",
      key: `insight:${todayIso.slice(0, 7)}:${bestIncrease.name}`,
      title: items.insight.title,
      body: items.insight.body
        .replace("{text}", `Tu gasto en ${bestIncrease.name} aumentó ${bestIncrease.pct.toFixed(0)}% este mes.`),
    });
  }

  /* Inserta (con tope por corrida para no saturar). */
  const toInsert = pending.slice(0, NEW_CAP_PER_RUN);
  if (toInsert.length === 0) return 0;
  await db.insert(notifications).values(
    toInsert.map((n) => ({
      userId,
      kind: n.type,
      title: n.title,
      body: n.body,
      channel: "in_app" as const,
      status: "pending" as const,
      sentAt: new Date(),
      metadata: { key: n.key, type: n.type },
    })),
  );
  return toInsert.length;
}

/* ── Helpers de fecha y formato ──────────────────────────────────────── */

function formatAmount(minor: number, currency: string): string {
  return formatMoney(minor, { currency: currency as never });
}

function formatDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(parsed);
}

function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(`${fromIso}T00:00:00Z`).getTime();
  const to = new Date(`${toIso}T00:00:00Z`).getTime();
  return Math.round((to - from) / 86400000);
}

function whenLabel(days: number): string {
  const dict = getDictionary().notifications.items;
  if (days <= 0) return "hoy";
  if (days === 1) return "mañana";
  return `en ${days} días`;
}

function nextDueIso(dueDay: number, now: Date): string {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(dueDay, daysInMonth);
  const thisMonth = new Date(Date.UTC(year, month, day));
  const todayMidnight = Date.UTC(year, month, now.getUTCDate());
  if (thisMonth.getTime() >= todayMidnight) return thisMonth.toISOString().slice(0, 10);
  const nextMonthDays = new Date(Date.UTC(year, month + 2, 0)).getUTCDate();
  return new Date(Date.UTC(year, month + 1, Math.min(dueDay, nextMonthDays)))
    .toISOString()
    .slice(0, 10);
}

/* ── Consulta y acciones del centro ──────────────────────────────────── */

function timeAgoLabel(iso: Date, dict: ReturnType<typeof getDictionary>): string {
  const diffMs = Date.now() - iso.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const t = dict.notifications.items.time;
  if (minutes < 1) return t.now;
  if (minutes < 60) return t.minutes.replace("{n}", String(minutes));
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.hours.replace("{n}", String(hours));
  const days = Math.floor(hours / 24);
  if (days === 1) return t.yesterday;
  if (days < 30) return t.days.replace("{n}", String(days));
  const months = Math.floor(days / 30);
  return t.months.replace("{n}", String(months));
}

export async function getNotificationsData(userId: string): Promise<NotificationsData> {
  const dict = getDictionary();
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(100);

  const items: NotificationView[] = rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    title: row.title,
    body: row.body ?? "",
    isRead: row.status === "read" || row.status === "dismissed",
    createdAtIso: row.createdAt.toISOString(),
    timeAgo: timeAgoLabel(row.createdAt, dict),
  }));

  return {
    items,
    unreadCount: rows.filter((row) => row.status === "pending" || row.status === "sent").length,
    enabledTypes: await getEnabledTypes(userId),
  };
}

export async function markRead(userId: string, id: string): Promise<boolean> {
  const rows = await db
    .update(notifications)
    .set({ status: "read", readAt: new Date() })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
    .returning({ id: notifications.id });
  return rows.length > 0;
}

export async function markAllRead(userId: string): Promise<number> {
  const rows = await db
    .update(notifications)
    .set({ status: "read", readAt: new Date() })
    .where(
      and(
        eq(notifications.userId, userId),
        inArray(notifications.status, ["pending", "sent"]),
      ),
    )
    .returning({ id: notifications.id });
  return rows.length;
}

/** Limpia (descarta) las notificaciones ya leídas. */
export async function clearRead(userId: string): Promise<number> {
  const rows = await db
    .update(notifications)
    .set({ status: "dismissed" })
    .where(and(eq(notifications.userId, userId), eq(notifications.status, "read")))
    .returning({ id: notifications.id });
  return rows.length;
}

export async function markReadAllVisible(userId: string, ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  const rows = await db
    .update(notifications)
    .set({ status: "read", readAt: new Date() })
    .where(and(eq(notifications.userId, userId), inArray(notifications.id, ids)))
    .returning({ id: notifications.id });
  return rows.length;
}

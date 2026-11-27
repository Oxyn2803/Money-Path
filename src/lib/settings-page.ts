/**
 * Configuración (Etapa 21) — SOLO SERVIDOR.
 * Perfil, preferencias (tema, moneda, notificaciones, panel), controles de
 * privacidad y solicitudes de cuenta. Nunca elimina datos financieros: la
 * exclusión se registra como solicitud pendiente con confirmación explícita.
 */

import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  academyProgress,
  aiConversations,
  aiMessages,
  assets,
  budgets,
  calculations,
  debtPayments,
  debts,
  emergencyFunds,
  expenseCategories,
  expenses,
  financialProfiles,
  futureReceipts,
  goalContributions,
  goals,
  income,
  incomeCategories,
  installments,
  investmentAccounts,
  investmentTransactions,
  investments,
  liabilities,
  moneyPathStates,
  netWorthSnapshots,
  notifications,
  profiles,
  recurringTransactions,
  userSettings,
} from "@/db/schema";
import { isCurrencyCode } from "@/config/locales";
import { isOnboardingCountry } from "@/config/onboarding";

export const THEME_KEY = "ui.theme";
export const DELETION_KEY = "account.deletionRequest";
export const DASHBOARD_KEY = "dashboard.indicators";
export const NOTIFICATIONS_KEY = "notifications.enabled";

export type ThemeId = "light" | "dark";
export const THEME_IDS: ThemeId[] = ["light", "dark"];

/** Tema persistido (default claro); el atributo data-theme se aplica en el layout. */
export async function getTheme(userId: string): Promise<ThemeId> {
  const rows = await db
    .select()
    .from(userSettings)
    .where(and(eq(userSettings.userId, userId), eq(userSettings.key, THEME_KEY)))
    .limit(1);
  const value = rows[0]?.value as { theme?: unknown } | null;
  return value?.theme === "dark" ? "dark" : "light";
}

export async function setTheme(userId: string, theme: ThemeId): Promise<void> {
  const value = { theme };
  await db
    .insert(userSettings)
    .values({ userId, key: THEME_KEY, value })
    .onConflictDoUpdate({ target: [userSettings.userId, userSettings.key], set: { value } });
}

export interface SettingsData {
  name: string;
  country: string;
  language: string;
  baseCurrency: string;
  theme: ThemeId;
  dashboardVisible: string[];
  notificationsEnabled: string[];
  deletionRequest: { requestedAt: string; status: string } | null;
  aiConversations: number;
  academyDone: number;
  academyFavorites: number;
}

export async function getSettingsData(userId: string): Promise<SettingsData | null> {
  const [profileRow, financialRow, theme, dash, notifs, deletion, aiRows, academyDone, academyFav] =
    await Promise.all([
      db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1),
      db.select().from(financialProfiles).where(eq(financialProfiles.userId, userId)).limit(1),
      getTheme(userId),
      db
        .select()
        .from(userSettings)
        .where(and(eq(userSettings.userId, userId), eq(userSettings.key, DASHBOARD_KEY)))
        .limit(1),
      db
        .select()
        .from(userSettings)
        .where(and(eq(userSettings.userId, userId), eq(userSettings.key, NOTIFICATIONS_KEY)))
        .limit(1),
      db
        .select()
        .from(userSettings)
        .where(and(eq(userSettings.userId, userId), eq(userSettings.key, DELETION_KEY)))
        .limit(1),
      db.select({ id: aiConversations.id }).from(aiConversations).where(eq(aiConversations.userId, userId)),
      db
        .select({ id: academyProgress.id })
        .from(academyProgress)
        .where(and(eq(academyProgress.userId, userId), eq(academyProgress.isCompleted, true))),
      db
        .select({ id: academyProgress.id })
        .from(academyProgress)
        .where(and(eq(academyProgress.userId, userId), eq(academyProgress.isFavorite, true))),
    ]);

  const user = profileRow[0];
  const financial = financialRow[0];
  if (!user || !financial) return null;

  const dashboardValue = dash[0]?.value as { visible?: unknown } | null;
  const notifValue = notifs[0]?.value as { enabled?: unknown } | null;
  const deletionValue = deletion[0]?.value as { requestedAt?: unknown; status?: unknown } | null;

  return {
    name: user.displayName ?? "",
    country: financial.country,
    language: user.locale ?? "es-MX",
    baseCurrency: financial.baseCurrency,
    theme,
    dashboardVisible: Array.isArray(dashboardValue?.visible)
      ? (dashboardValue.visible as unknown[]).filter((v): v is string => typeof v === "string")
      : [],
    notificationsEnabled: Array.isArray(notifValue?.enabled)
      ? (notifValue.enabled as unknown[]).filter((v): v is string => typeof v === "string")
      : [],
    deletionRequest:
      deletionValue &&
      typeof deletionValue.requestedAt === "string" &&
      deletionValue.status === "pending"
        ? { requestedAt: deletionValue.requestedAt, status: "pending" }
        : null,
    aiConversations: aiRows.length,
    academyDone: academyDone.length,
    academyFavorites: academyFav.length,
  };
}

/* ── Perfil ──────────────────────────────────────────────────────────── */

/**
 * Idiomas con diccionario completo (Etapa 29 — localización pt-BR).
 * Es la fuente de verdad del selector de idioma de Configuración; `pt-BR`
 * es la localización nueva y completa para Brasil.
 */
export { ACTIVE_LANGUAGES, FUTURE_LANGUAGES } from "@/config/languages";
import { ACTIVE_LANGUAGES } from "@/config/languages";

export async function updateProfileFields(
  userId: string,
  fields: { country?: string; language?: string },
): Promise<{ ok: boolean; error?: "country" | "language" }> {
  if (fields.country !== undefined && !isOnboardingCountry(fields.country)) {
    return { ok: false, error: "country" };
  }
  if (
    fields.language !== undefined &&
    !(ACTIVE_LANGUAGES as readonly string[]).includes(fields.language)
  ) {
    return { ok: false, error: "language" };
  }

  if (fields.country !== undefined) {
    await db.update(financialProfiles).set({ country: fields.country }).where(eq(financialProfiles.userId, userId));
  }
  if (fields.language !== undefined) {
    await db.update(profiles).set({ locale: fields.language }).where(eq(profiles.userId, userId));
  }
  return { ok: true };
}

/** Sincroniza el nombre visible tras updateUser de Better Auth. */
export async function syncDisplayName(userId: string, name: string): Promise<void> {
  await db.update(profiles).set({ displayName: name }).where(eq(profiles.userId, userId));
}

/* ── Moneda base con puerta de confirmación ──────────────────────────── */

async function countForeignRecords(userId: string, newCurrency: string): Promise<number> {
  const queries = [
    db.select({ id: income.id }).from(income).where(and(eq(income.userId, userId), ne(income.currency, newCurrency))),
    db.select({ id: expenses.id }).from(expenses).where(and(eq(expenses.userId, userId), ne(expenses.currency, newCurrency))),
    db.select({ id: debts.id }).from(debts).where(and(eq(debts.userId, userId), ne(debts.currency, newCurrency))),
    db.select({ id: goals.id }).from(goals).where(and(eq(goals.userId, userId), ne(goals.currency, newCurrency))),
    db
      .select({ id: emergencyFunds.id })
      .from(emergencyFunds)
      .where(and(eq(emergencyFunds.userId, userId), ne(emergencyFunds.currency, newCurrency))),
    db
      .select({ id: investments.id })
      .from(investments)
      .where(and(eq(investments.userId, userId), ne(investments.currency, newCurrency))),
    db.select({ id: assets.id }).from(assets).where(and(eq(assets.userId, userId), ne(assets.currency, newCurrency))),
    db
      .select({ id: liabilities.id })
      .from(liabilities)
      .where(and(eq(liabilities.userId, userId), ne(liabilities.currency, newCurrency))),
  ];
  const results = await Promise.all(queries);
  return results.reduce((acc, rows) => acc + rows.length, 0);
}

export interface CurrencyGate {
  allowed: boolean;
  needsConfirm: boolean;
  foreignRecords: number;
  hasProfileAmounts: boolean;
}

export async function canChangeCurrency(userId: string, newCurrency: string): Promise<CurrencyGate> {
  if (!isCurrencyCode(newCurrency)) {
    return { allowed: false, needsConfirm: false, foreignRecords: 0, hasProfileAmounts: false };
  }
  const foreign = await countForeignRecords(userId, newCurrency);
  const profileRows = await db
    .select()
    .from(financialProfiles)
    .where(eq(financialProfiles.userId, userId))
    .limit(1);
  const profile = profileRows[0];
  const hasProfileAmounts = Boolean(
    profile &&
      (Number(profile.monthlyIncome ?? 0) > 0 ||
        Number(profile.monthlyFixedExpenses ?? 0) > 0 ||
        Number(profile.totalDebts ?? 0) > 0 ||
        Number(profile.currentReserve ?? 0) > 0 ||
        Number(profile.currentInvestments ?? 0) > 0 ||
        Number(profile.approximateNetWorth ?? 0) > 0),
  );
  return { allowed: true, needsConfirm: foreign > 0 || hasProfileAmounts, foreignRecords: foreign, hasProfileAmounts };
}

export async function setBaseCurrency(userId: string, newCurrency: string): Promise<boolean> {
  if (!isCurrencyCode(newCurrency)) return false;
  await db.update(financialProfiles).set({ baseCurrency: newCurrency }).where(eq(financialProfiles.userId, userId));
  return true;
}

/* ── Privacidad: acciones sobre datos no financieros ─────────────────── */

export async function clearAiHistory(userId: string): Promise<{ messages: number; conversations: number }> {
  const [m, c] = await Promise.all([
    db.delete(aiMessages).where(eq(aiMessages.userId, userId)).returning({ id: aiMessages.id }),
    db.delete(aiConversations).where(eq(aiConversations.userId, userId)).returning({ id: aiConversations.id }),
  ]);
  return { messages: m.length, conversations: c.length };
}

export async function resetAcademyProgress(userId: string): Promise<number> {
  const rows = await db.delete(academyProgress).where(eq(academyProgress.userId, userId)).returning({ id: academyProgress.id });
  return rows.length;
}

/* ── Cuenta: solicitud de exclusión (no borra nada) ──────────────────── */

export async function requestDeletion(userId: string): Promise<void> {
  const value = { requestedAt: new Date().toISOString(), status: "pending" };
  await db
    .insert(userSettings)
    .values({ userId, key: DELETION_KEY, value })
    .onConflictDoUpdate({ target: [userSettings.userId, userSettings.key], set: { value } });
}

export async function cancelDeletion(userId: string): Promise<void> {
  await db.delete(userSettings).where(and(eq(userSettings.userId, userId), eq(userSettings.key, DELETION_KEY)));
}

/* ── Exportación de datos (JSON) ─────────────────────────────────────── */

export async function exportUserData(userId: string): Promise<Record<string, unknown>> {
  const [
    profileRows,
    financialRows,
    settingsRows,
    incomeRows,
    expenseRows,
    incomeCat,
    expenseCat,
    debtRows,
    debtPayRows,
    installmentRows,
    recurringRows,
    receiptRows,
    goalRows,
    goalContribRows,
    fundRows,
    invAccounts,
    invRows,
    invTxRows,
    assetRows,
    liabilityRows,
    snapshotRows,
    budgetRows,
    notifRows,
    aiConv,
    aiMsgs,
    academyProg,
    calcRows,
    pathStates,
  ] = await Promise.all([
    db.select().from(profiles).where(eq(profiles.userId, userId)),
    db.select().from(financialProfiles).where(eq(financialProfiles.userId, userId)),
    db.select().from(userSettings).where(eq(userSettings.userId, userId)),
    db.select().from(income).where(eq(income.userId, userId)),
    db.select().from(expenses).where(eq(expenses.userId, userId)),
    db.select().from(incomeCategories).where(eq(incomeCategories.userId, userId)),
    db.select().from(expenseCategories).where(eq(expenseCategories.userId, userId)),
    db.select().from(debts).where(eq(debts.userId, userId)),
    db.select().from(debtPayments).where(eq(debtPayments.userId, userId)),
    db.select().from(installments).where(eq(installments.userId, userId)),
    db.select().from(recurringTransactions).where(eq(recurringTransactions.userId, userId)),
    db.select().from(futureReceipts).where(eq(futureReceipts.userId, userId)),
    db.select().from(goals).where(eq(goals.userId, userId)),
    db.select().from(goalContributions).where(eq(goalContributions.userId, userId)),
    db.select().from(emergencyFunds).where(eq(emergencyFunds.userId, userId)),
    db.select().from(investmentAccounts).where(eq(investmentAccounts.userId, userId)),
    db.select().from(investments).where(eq(investments.userId, userId)),
    db.select().from(investmentTransactions).where(eq(investmentTransactions.userId, userId)),
    db.select().from(assets).where(eq(assets.userId, userId)),
    db.select().from(liabilities).where(eq(liabilities.userId, userId)),
    db.select().from(netWorthSnapshots).where(eq(netWorthSnapshots.userId, userId)),
    db.select().from(budgets).where(eq(budgets.userId, userId)),
    db.select().from(notifications).where(eq(notifications.userId, userId)),
    db.select().from(aiConversations).where(eq(aiConversations.userId, userId)),
    db.select().from(aiMessages).where(eq(aiMessages.userId, userId)),
    db.select().from(academyProgress).where(eq(academyProgress.userId, userId)),
    db.select().from(calculations).where(eq(calculations.userId, userId)),
    db.select().from(moneyPathStates).where(eq(moneyPathStates.userId, userId)),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    format: "money-path-export-v1",
    data: {
      profile: profileRows[0] ?? null,
      financialProfile: financialRows[0] ?? null,
      settings: settingsRows,
      income: incomeRows,
      expenses: expenseRows,
      incomeCategories: incomeCat,
      expenseCategories: expenseCat,
      debts: debtRows,
      debtPayments: debtPayRows,
      installments: installmentRows,
      recurringTransactions: recurringRows,
      futureReceipts: receiptRows,
      goals: goalRows,
      goalContributions: goalContribRows,
      emergencyFunds: fundRows,
      investmentAccounts: invAccounts,
      investments: invRows,
      investmentTransactions: invTxRows,
      assets: assetRows,
      liabilities: liabilityRows,
      netWorthSnapshots: snapshotRows,
      budgets: budgetRows,
      notifications: notifRows,
      aiConversations: aiConv,
      aiMessages: aiMsgs,
      academyProgress: academyProg,
      calculations: calcRows,
      moneyPathStates: pathStates,
    },
  };
}

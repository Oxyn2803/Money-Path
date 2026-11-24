/**
 * Academia (Etapa 19) — SOLO SERVIDOR.
 * Carga categorías, contenidos publicados y el progreso del usuario
 * (concluidos y favoritos).
 */

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { academyCategories, academyContents, academyProgress, financialProfiles } from "@/db/schema";

export interface AcademyContentView {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  kind: string;
  body: string;
  durationMinutes: number | null;
  level: string;
  isCompleted: boolean;
  isFavorite: boolean;
}

export interface AcademyCategoryView {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  contentsCount: number;
  completedCount: number;
}

export interface AcademyData {
  categories: AcademyCategoryView[];
  contents: AcademyContentView[];
  progress: {
    total: number;
    completed: number;
    favorites: number;
    percent: number;
  };
}

/** Contenido educativo general; el body puede ser largo (texto plano). */
export async function getAcademyData(userId: string): Promise<AcademyData | null> {
  const profileRows = await db
    .select({ onboardingCompletedAt: financialProfiles.onboardingCompletedAt })
    .from(financialProfiles)
    .where(eq(financialProfiles.userId, userId))
    .limit(1);
  if (profileRows.length === 0 || !profileRows[0].onboardingCompletedAt) return null;

  const [categoryRows, contentRows, progressRows] = await Promise.all([
    db
      .select()
      .from(academyCategories)
      .where(eq(academyCategories.isActive, true))
      .orderBy(asc(academyCategories.sortOrder), asc(academyCategories.name)),
    db
      .select()
      .from(academyContents)
      .where(eq(academyContents.isPublished, true))
      .orderBy(asc(academyContents.slug)),
    db
      .select()
      .from(academyProgress)
      .where(eq(academyProgress.userId, userId)),
  ]);

  const progressByContent = new Map(
    progressRows.map((row) => [row.contentId, { completed: row.isCompleted, favorite: row.isFavorite }]),
  );

  const contents: AcademyContentView[] = contentRows.map((row) => {
    const state = progressByContent.get(row.id);
    return {
      id: row.id,
      categoryId: row.categoryId,
      title: row.title,
      slug: row.slug,
      kind: row.kind,
      body: row.body ?? "",
      durationMinutes: row.durationMinutes,
      level: row.level,
      isCompleted: state?.completed ?? false,
      isFavorite: state?.favorite ?? false,
    };
  });

  const categories: AcademyCategoryView[] = categoryRows.map((row) => {
    const catContents = contents.filter((content) => content.categoryId === row.id);
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      contentsCount: catContents.length,
      completedCount: catContents.filter((content) => content.isCompleted).length,
    };
  });

  const total = contents.length;
  const completed = contents.filter((content) => content.isCompleted).length;
  const favorites = contents.filter((content) => content.isFavorite).length;

  return {
    categories,
    contents,
    progress: {
      total,
      completed,
      favorites,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    },
  };
}

/** Marca/desmarca un contenido como concluido o favorito (upsert). */
export async function setAcademyProgress(
  userId: string,
  contentId: string,
  field: "completed" | "favorite",
  value: boolean,
): Promise<boolean> {
  // Verifica que el contenido exista y sea del catálogo publicado.
  const content = await db
    .select({ id: academyContents.id })
    .from(academyContents)
    .where(and(eq(academyContents.id, contentId), eq(academyContents.isPublished, true)))
    .limit(1);
  if (content.length === 0) return false;

  const existing = await db
    .select({ id: academyProgress.id, isCompleted: academyProgress.isCompleted, isFavorite: academyProgress.isFavorite })
    .from(academyProgress)
    .where(and(eq(academyProgress.userId, userId), eq(academyProgress.contentId, contentId)))
    .limit(1);

  const nextCompleted = field === "completed" ? value : (existing[0]?.isCompleted ?? false);
  const nextFavorite = field === "favorite" ? value : (existing[0]?.isFavorite ?? false);

  if (existing.length > 0) {
    await db
      .update(academyProgress)
      .set({
        isCompleted: nextCompleted,
        isFavorite: nextFavorite,
        completedAt: nextCompleted ? (existing[0].isCompleted ? undefined : new Date()) : null,
        updatedAt: new Date(),
      })
      .where(eq(academyProgress.id, existing[0].id));
  } else {
    await db.insert(academyProgress).values({
      userId,
      contentId,
      isCompleted: nextCompleted,
      isFavorite: nextFavorite,
      completedAt: nextCompleted ? new Date() : null,
    });
  }
  return true;
}

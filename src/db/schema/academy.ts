import {
  boolean,
  index,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { id, timestamps } from "./common";
import { users } from "./identity";

/** Contenido educativo global (no pertenece a un usuario). */
export const academyCategories = pgTable(
  "academy_categories",
  {
    id: id(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("academy_categories_active_idx").on(t.isActive, t.sortOrder)],
);

export const academyContents = pgTable(
  "academy_contents",
  {
    id: id(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => academyCategories.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    kind: text("kind", {
      enum: ["article", "video", "lesson", "guide", "tip"],
    })
      .notNull()
      .default("article"),
    body: text("body"),
    url: text("url"),
    durationMinutes: smallint("duration_minutes"),
    level: text("level", {
      enum: ["beginner", "intermediate", "advanced"],
    })
      .notNull()
      .default("beginner"),
    isPublished: boolean("is_published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("academy_contents_category_idx").on(t.categoryId, t.isPublished),
  ],
);

/**
 * Progreso del usuario en la Academia (Etapa 19):
 * contenidos concluidos y favoritos. Un registro por (usuario, contenido).
 */
export const academyProgress = pgTable(
  "academy_progress",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contentId: uuid("content_id")
      .notNull()
      .references(() => academyContents.id, { onDelete: "cascade" }),
    isCompleted: boolean("is_completed").notNull().default(false),
    isFavorite: boolean("is_favorite").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("academy_progress_user_idx").on(t.userId),
    // Sin duplicados: un único estado por usuario y contenido.
    uniqueIndex("academy_progress_user_content_unique").on(t.userId, t.contentId),
  ],
);

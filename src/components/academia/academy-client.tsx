"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconBook, IconCheck, IconHeart, IconInfo, IconPlay, IconRoute } from "@/components/icons";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { useDictionary } from "@/lib/i18n";
import type { AcademyContentView, AcademyData } from "@/lib/academy";

type Filter = "all" | "favorites" | "completed";

function kindIcon(kind: string) {
  if (kind === "video") return <IconPlay size={13} />;
  if (kind === "guide" || kind === "lesson") return <IconRoute size={13} />;
  if (kind === "tip") return <IconInfo size={13} />;
  return <IconBook size={13} />;
}

/** Academia: catálogo, progreso, favoritos y visor de contenidos. */
export function AcademyModule({ data }: { data: AcademyData }) {
  const dict = useDictionary();
  const router = useRouter();
  const { toast } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [openContent, setOpenContent] = useState<AcademyContentView | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = data.contents;
    if (activeCategory !== "all") {
      list = list.filter((content) => content.categoryId === activeCategory);
    }
    if (filter === "favorites") list = list.filter((content) => content.isFavorite);
    if (filter === "completed") list = list.filter((content) => content.isCompleted);
    return list;
  }, [data.contents, activeCategory, filter]);

  const emptyMessage =
    filter === "favorites"
      ? dict.academia.emptyFavorites
      : filter === "completed"
        ? dict.academia.emptyCompleted
        : dict.academia.empty;

  async function toggle(content: AcademyContentView, field: "completed" | "favorite") {
    const value = field === "completed" ? !content.isCompleted : !content.isFavorite;
    setBusyId(content.id);
    try {
      const response = await fetch("/api/academy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId: content.id, field, value }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        toast({ title: payload?.message ?? dict.auth.errors.generic, variant: "danger" });
        return;
      }
      setOpenContent((current) =>
        current && current.id === content.id
          ? {
              ...current,
              isCompleted: field === "completed" ? value : current.isCompleted,
              isFavorite: field === "favorite" ? value : current.isFavorite,
            }
          : current,
      );
      router.refresh();
    } catch {
      toast({ title: dict.auth.errors.generic, variant: "danger" });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Nota de alcance (siempre visible) */}
      <p className="flex items-start gap-2 text-[11px] leading-relaxed text-faint">
        <IconInfo size={13} className="mt-0.5 shrink-0 text-accent-500" />
        {dict.academia.contentNote} {dict.academia.disclaimer}
      </p>

      {/* Progreso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{dict.academia.progress.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text">
              {dict.academia.progress.completed
                .replace("{done}", String(data.progress.completed))
                .replace("{total}", String(data.progress.total))}
            </span>
            <span className="font-display text-sm font-bold tabular-nums text-primary-900">
              {dict.academia.progress.percent.replace("{pct}", String(data.progress.percent))}
            </span>
          </div>
          <div className="mt-2">
            <Progress value={data.progress.percent} tone="success" size="sm" />
          </div>
          <div className="mt-2 flex items-center gap-4 text-[11px] text-faint">
            <span>
              {dict.academia.filters.completed}: {data.progress.completed}
            </span>
            <span>
              {dict.academia.filters.favorites}: {data.progress.favorites}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Categorías */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
            activeCategory === "all"
              ? "border-primary bg-primary text-primary-50"
              : "border-border bg-surface text-muted hover:border-primary-300 hover:text-primary-700"
          }`}
        >
          {dict.academia.filters.all}
        </button>
        {data.categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
              activeCategory === category.id
                ? "border-primary bg-primary text-primary-50"
                : "border-border bg-surface text-muted hover:border-primary-300 hover:text-primary-700"
            }`}
          >
            {category.name}
            <span className="ml-1.5 text-[10px] opacity-70">
              {category.completedCount}/{category.contentsCount}
            </span>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2" role="group" aria-label={dict.academia.filtersLabel}>
        {(["all", "favorites", "completed"] as Filter[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === option
                ? "border-primary-300 bg-primary-soft text-primary-800"
                : "border-border bg-surface text-faint hover:text-text"
            }`}
          >
            {dict.academia.filters[option]}
          </button>
        ))}
      </div>

      {/* Contenidos */}
      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-strong px-4 py-8 text-center text-sm text-faint">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((content) => (
            <Card key={content.id} className={`flex flex-col ${content.isCompleted ? "border-success/40" : ""}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="primary">
                      <span className="flex items-center gap-1">
                        {kindIcon(content.kind)}
                        {dict.academia.kinds[content.kind as keyof typeof dict.academia.kinds] ?? content.kind}
                      </span>
                    </Badge>
                    <Badge tone="outline">
                      {dict.academia.levels[content.level as keyof typeof dict.academia.levels] ?? content.level}
                    </Badge>
                  </div>
                  <h3 className="mt-2 font-display text-sm font-semibold leading-snug text-text">
                    {content.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => void toggle(content, "favorite")}
                  aria-label={
                    content.isFavorite
                      ? dict.academia.actions.unfavorite
                      : dict.academia.actions.favorite
                  }
                  disabled={busyId === content.id}
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors ${
                    content.isFavorite
                      ? "bg-danger-soft text-danger"
                      : "text-faint hover:bg-background hover:text-danger"
                  }`}
                >
                  <IconHeart size={14} />
                </button>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-3">
                <p className="text-[11px] text-faint">
                  {content.durationMinutes
                    ? dict.academia.minutes.replace("{n}", String(content.durationMinutes))
                    : ""}
                  {content.isCompleted ? (
                    <span className="ml-2 inline-flex items-center gap-1 font-bold text-success">
                      <IconCheck size={11} /> {dict.academia.done}
                    </span>
                  ) : null}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="soft" onClick={() => setOpenContent(content)}>
                    {dict.academia.actions.read}
                  </Button>
                  <Button
                    size="sm"
                    variant={content.isCompleted ? "secondary" : "ghost"}
                    iconLeft={<IconCheck size={13} />}
                    disabled={busyId === content.id}
                    onClick={() => void toggle(content, "completed")}
                  >
                    {content.isCompleted
                      ? dict.academia.actions.markPending
                      : dict.academia.actions.markDone}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Visor */}
      <Modal
        open={openContent !== null}
        onOpenChange={(open) => !open && setOpenContent(null)}
        title={openContent?.title}
        description={
          openContent
            ? `${dict.academia.kinds[openContent.kind as keyof typeof dict.academia.kinds] ?? openContent.kind}${
                openContent.durationMinutes
                  ? ` · ${dict.academia.minutes.replace("{n}", String(openContent.durationMinutes))}`
                  : ""
              }`
            : undefined
        }
        size="lg"
        footer={
          openContent ? (
            <>
              <Button variant="secondary" onClick={() => setOpenContent(null)}>
                {dict.academia.actions.close}
              </Button>
              <Button
                iconLeft={<IconCheck size={14} />}
                variant={openContent.isCompleted ? "secondary" : "primary"}
                disabled={busyId === openContent.id}
                onClick={() => void toggle(openContent, "completed")}
              >
                {openContent.isCompleted
                  ? dict.academia.actions.markPending
                  : dict.academia.actions.markDone}
              </Button>
            </>
          ) : undefined
        }
      >
        <div className="flex flex-col gap-4">
          <div className="whitespace-pre-line text-sm leading-relaxed text-text">
            {openContent?.body}
          </div>
          <Alert variant="info" title={dict.academia.contentNote} />
        </div>
      </Modal>
    </div>
  );
}

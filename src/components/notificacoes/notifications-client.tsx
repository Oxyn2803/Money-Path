"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconAlertCircle,
  IconBell,
  IconCalendar,
  IconCheck,
  IconCreditCard,
  IconHeart,
  IconInfo,
  IconRoute,
  IconSparkles,
  IconTarget,
  IconTrash,
} from "@/components/icons";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { getDictionary } from "@/lib/i18n";
import {
  NOTIFICATION_TYPES,
  type NotificationType,
  type NotificationsData,
} from "@/lib/notifications-shared";

function typeIcon(kind: string) {
  switch (kind) {
    case "future_receipt":
      return <IconCalendar size={14} />;
    case "due_date":
      return <IconAlertCircle size={14} />;
    case "installment":
      return <IconCreditCard size={14} />;
    case "goal":
      return <IconTarget size={14} />;
    case "debt":
      return <IconCheck size={14} />;
    case "budget":
      return <IconInfo size={14} />;
    case "emergency_fund":
      return <IconHeart size={14} />;
    default:
      return <IconSparkles size={14} />;
  }
}

/** Centro de notificaciones: contador, lectura, limpieza y preferencias. */
export function NotificationsCenter({ data }: { data: NotificationsData }) {
  const dict = getDictionary();
  const router = useRouter();
  const { toast } = useToast();

  const [prefsOpen, setPrefsOpen] = useState(false);
  const [enabled, setEnabled] = useState<Set<NotificationType>>(new Set(data.enabledTypes));
  const [busy, setBusy] = useState<string | null>(null);

  async function post(payload: Record<string, unknown>, successMessage?: string): Promise<boolean> {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const payloadError = (await response.json().catch(() => null)) as { message?: string } | null;
        toast({ title: payloadError?.message ?? dict.auth.errors.generic, variant: "danger" });
        return false;
      }
      if (successMessage) toast({ title: successMessage, variant: "success" });
      return true;
    } catch {
      toast({ title: dict.auth.errors.generic, variant: "danger" });
      return false;
    }
  }

  async function markRead(id: string) {
    setBusy(id);
    const ok = await post({ op: "read", id });
    setBusy(null);
    if (ok) router.refresh();
  }

  async function markAll() {
    setBusy("all");
    const ok = await post({ op: "readAll" }, dict.notifications.allRead);
    setBusy(null);
    if (ok) router.refresh();
  }

  async function clear() {
    setBusy("clear");
    const ok = await post({ op: "clear" }, dict.notifications.cleared);
    setBusy(null);
    if (ok) router.refresh();
  }

  async function savePreferences() {
    setBusy("prefs");
    const ok = await post(
      { op: "preferences", enabled: Array.from(enabled) },
      dict.notifications.preferencesSaved,
    );
    setBusy(null);
    if (ok) {
      setPrefsOpen(false);
      router.refresh();
    }
  }

  function toggleType(type: NotificationType, value: boolean) {
    setEnabled((current) => {
      const next = new Set(current);
      if (value) next.add(type);
      else next.delete(type);
      return next;
    });
  }

  const unread = data.items.filter((item) => !item.isRead).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Contador + acciones */}
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary-700">
              <IconBell size={17} />
              {unread > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                  {unread > 99 ? "99+" : unread}
                </span>
              ) : null}
            </span>
            <div>
              <CardTitle className="text-sm">{dict.notifications.title}</CardTitle>
              <p className="text-[11px] text-faint">
                {unread > 0
                  ? dict.notifications.unread.replace("{n}", String(unread))
                  : dict.notifications.allRead}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              iconLeft={<IconCheck size={13} />}
              disabled={busy !== null || unread === 0}
              loading={busy === "all"}
              onClick={() => void markAll()}
            >
              {dict.notifications.markAllRead}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              iconLeft={<IconTrash size={13} />}
              disabled={busy !== null}
              loading={busy === "clear"}
              onClick={() => void clear()}
            >
              {dict.notifications.clear}
            </Button>
            <Button size="sm" variant="soft" onClick={() => setPrefsOpen(true)}>
              {dict.notifications.preferences}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Lista */}
      {data.items.length === 0 ? (
        <EmptyState
          icon={<IconBell size={20} />}
          title={dict.notifications.empty}
          description={dict.notifications.emptyHint}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {data.items.map((item) => (
            <li key={item.id}>
              <Card className={item.isRead ? "opacity-70" : ""}>
                <CardContent className="flex items-start gap-3 px-4 py-3.5">
                  <span
                    className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      item.isRead ? "bg-background text-faint" : "bg-primary-soft text-primary-700"
                    }`}
                  >
                    {typeIcon(item.kind)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-sm ${item.isRead ? "font-semibold text-muted" : "font-bold text-text"}`}>
                        {item.title}
                      </p>
                      <Badge tone="outline">
                        {dict.notifications.types[item.kind as keyof typeof dict.notifications.types] ?? item.kind}
                      </Badge>
                      {!item.isRead ? (
                        <span aria-hidden className="h-2 w-2 rounded-full bg-danger" />
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.body}</p>
                    <p className="mt-1 text-[11px] text-faint">{item.timeAgo}</p>
                  </div>
                  {!item.isRead ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy === item.id}
                      onClick={() => void markRead(item.id)}
                    >
                      {dict.notifications.markRead}
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <p className="flex items-start gap-2 text-[11px] leading-relaxed text-faint">
        <IconInfo size={13} className="mt-0.5 shrink-0 text-accent-500" />
        {dict.notifications.generatedNote}
      </p>

      {/* Preferencias */}
      <Modal
        open={prefsOpen}
        onOpenChange={setPrefsOpen}
        title={dict.notifications.preferencesTitle}
        description={dict.notifications.preferencesDesc}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPrefsOpen(false)} disabled={busy === "prefs"}>
              {dict.presupuesto.form.cancel}
            </Button>
            <Button loading={busy === "prefs"} onClick={() => void savePreferences()}>
              {dict.dashboard.customize.save}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3.5 py-1">
          {NOTIFICATION_TYPES.map((type) => (
            <Switch
              key={type}
              label={dict.notifications.types[type]}
              checked={enabled.has(type)}
              onCheckedChange={(value) => toggleType(type, value)}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

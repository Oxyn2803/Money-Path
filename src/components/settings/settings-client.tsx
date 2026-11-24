"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  IconAlertTriangle,
  IconCheck,
  IconDownload,
  IconLock,
  IconShield,
  IconSparkles,
  IconTrash,
} from "@/components/icons";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { ONBOARDING_COUNTRIES } from "@/config/onboarding";
import { CURRENCIES } from "@/config/locales";
import { getDictionary } from "@/lib/i18n";
import { signOut, changePassword, changeEmail } from "@/lib/auth-client";
import { NOTIFICATION_TYPES } from "@/lib/notifications-shared";
import type { SettingsData } from "@/lib/settings-page";

const DASHBOARD_INDICATORS = [
  "ingresos",
  "gastos",
  "saldo",
  "ahorro",
  "deudas",
  "fondo",
  "patrimonio",
] as const;
type DashIndicator = (typeof DASHBOARD_INDICATORS)[number];

export function SettingsModule({
  data,
  email,
}: {
  data: SettingsData;
  email: string;
}) {
  const dict = getDictionary();
  const router = useRouter();
  const { toast } = useToast();
  const s = dict.settings;

  const [tab, setTab] = useState("profile");

  /* Perfil */
  const [name, setName] = useState(data.name);
  const [savingName, setSavingName] = useState(false);
  const [country, setCountry] = useState(data.country);
  const [language, setLanguage] = useState(data.language);
  const [savingProfile, setSavingProfile] = useState(false);

  const [emailValue, setEmailValue] = useState(email);
  const [newEmail, setNewEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  /* Preferências */
  const [theme, setThemeState] = useState(data.theme);
  const [currency, setCurrency] = useState(data.baseCurrency);
  const [currencyConfirm, setCurrencyConfirm] = useState(false);
  const [currencyWarning, setCurrencyWarning] = useState(false);
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState<Set<string>>(
    new Set(
      data.notificationsEnabled.length > 0 ? data.notificationsEnabled : [...NOTIFICATION_TYPES],
    ),
  );
  const [dashVisible, setDashVisible] = useState<Set<string>>(
    new Set(
      data.dashboardVisible.length > 0
        ? data.dashboardVisible
        : [...DASHBOARD_INDICATORS],
    ),
  );

  /* Privacidade */
  const [busyPrivacy, setBusyPrivacy] = useState<string | null>(null);
  const [confirmClearAi, setConfirmClearAi] = useState(false);
  const [confirmResetAcademy, setConfirmResetAcademy] = useState(false);

  /* Conta */
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNext, setPwNext] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  const [deleteWord, setDeleteWord] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingBusy, setDeletingBusy] = useState(false);

  async function post(payload: Record<string, unknown>): Promise<{ ok: boolean; needsConfirm?: boolean; message?: string }> {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as
        | { message?: string; needsConfirm?: boolean }
        | null;
      if (!response.ok) {
        return { ok: false, needsConfirm: body?.needsConfirm, message: body?.message };
      }
      return { ok: true };
    } catch {
      return { ok: false, message: s.common.error };
    }
  }

  /* ── handlers ──────────────────────────────────────────────────────── */

  async function saveName(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSavingName(true);
    const result = await post({ op: "name", name: name.trim() });
    setSavingName(false);
    if (result.ok) {
      toast({ title: s.common.saved, variant: "success" });
      router.refresh();
    } else {
      toast({ title: result.message ?? s.common.error, variant: "danger" });
    }
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setSavingProfile(true);
    const result = await post({ op: "profile", country, language });
    setSavingProfile(false);
    if (result.ok) {
      toast({ title: s.common.saved, variant: "success" });
      router.refresh();
    } else {
      toast({ title: result.message ?? s.common.error, variant: "danger" });
    }
  }

  async function saveEmail(event: FormEvent) {
    event.preventDefault();
    setEmailError(null);
    const candidate = newEmail.trim();
    if (!candidate || !candidate.includes("@")) {
      setEmailError(dict.auth.register.emailInvalid);
      return;
    }
    setSavingEmail(true);
    try {
      const response = await changeEmail({ newEmail: candidate });
      setSavingEmail(false);
      if (response?.error) {
        setEmailError(s.profile.emailError);
        return;
      }
      toast({ title: s.profile.emailChanged, variant: "success" });
      setEmailValue(candidate);
      setNewEmail("");
      router.refresh();
    } catch {
      setSavingEmail(false);
      setEmailError(s.profile.emailError);
    }
  }

  async function saveTheme(next: string) {
    const value = next === "dark" ? "dark" : "light";
    setThemeState(value);
    await post({ op: "theme", theme: value });
    toast({ title: s.preferences.theme.saved, variant: "success" });
    router.refresh();
  }

  async function saveCurrency(event: FormEvent) {
    event.preventDefault();
    if (currency === data.baseCurrency) return;
    setSavingCurrency(true);
    setCurrencyWarning(false);
    const result = await post({ op: "currency", currency, confirm: currencyConfirm });
    setSavingCurrency(false);
    if (result.ok) {
      setCurrencyConfirm(false);
      toast({ title: s.preferences.currencySection.saved, variant: "success" });
      router.refresh();
      return;
    }
    if (result.needsConfirm) {
      setCurrencyWarning(true);
      return;
    }
    toast({ title: result.message ?? s.common.error, variant: "danger" });
  }

  async function saveNotifications() {
    const result = await post({ op: "notifications", enabled: Array.from(notifEnabled) });
    if (result.ok) {
      toast({ title: s.preferences.notificationsSection.saved, variant: "success" });
      router.refresh();
    } else {
      toast({ title: result.message ?? s.common.error, variant: "danger" });
    }
  }

  async function saveDashboard() {
    if (dashVisible.size === 0) {
      toast({ title: s.preferences.dashboardSection.minOne, variant: "danger" });
      return;
    }
    const result = await post({ op: "dashboard", visible: Array.from(dashVisible) });
    if (result.ok) {
      toast({ title: s.preferences.dashboardSection.saved, variant: "success" });
      router.refresh();
    } else {
      toast({ title: result.message ?? s.common.error, variant: "danger" });
    }
  }

  async function downloadExport() {
    setBusyPrivacy("export");
    try {
      const response = await fetch("/api/settings/export");
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `money-path-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast({ title: s.privacy.export.done, variant: "success" });
    } catch {
      toast({ title: s.privacy.export.error, variant: "danger" });
    } finally {
      setBusyPrivacy(null);
    }
  }

  async function privacyAction(op: "clear-ai" | "reset-academy") {
    setBusyPrivacy(op);
    const result = await post({ op });
    setBusyPrivacy(null);
    if (op === "clear-ai") setConfirmClearAi(false);
    if (op === "reset-academy") setConfirmResetAcademy(false);
    if (result.ok) {
      toast({
        title: op === "clear-ai" ? s.privacy.aiHistory.done : s.privacy.academy.done,
        variant: "success",
      });
      router.refresh();
    } else {
      toast({ title: result.message ?? s.common.error, variant: "danger" });
    }
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault();
    setPwError(null);
    if (pwNext !== pwConfirm) {
      setPwError(s.account.password.mismatch);
      return;
    }
    if (pwNext.trim().length < 8 || !pwCurrent) {
      setPwError(s.account.password.error);
      return;
    }
    setSavingPw(true);
    try {
      const response = await changePassword({
        currentPassword: pwCurrent,
        newPassword: pwNext,
      });
      setSavingPw(false);
      if (response?.error) {
        setPwError(s.account.password.error);
        return;
      }
      setPwCurrent("");
      setPwNext("");
      setPwConfirm("");
      toast({ title: s.account.password.done, variant: "success" });
    } catch {
      setSavingPw(false);
      setPwError(s.account.password.error);
    }
  }

  function handleLogout() {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  }

  async function submitDeletion() {
    if (deleteWord !== s.account.deletion.word) return;
    setDeletingBusy(true);
    const result = await post({ op: "deletion-request", word: deleteWord });
    setDeletingBusy(false);
    if (result.ok) {
      setConfirmDelete(false);
      setDeleteWord("");
      toast({ title: s.account.deletion.submitted, variant: "success" });
      router.refresh();
    } else {
      toast({ title: result.message ?? s.account.deletion.error, variant: "danger" });
    }
  }

  async function cancelDeletionRequest() {
    setDeletingBusy(true);
    await post({ op: "deletion-cancel" });
    setDeletingBusy(false);
    toast({ title: s.account.deletion.canceled, variant: "success" });
    router.refresh();
  }

  const requestedDate = data.deletionRequest
    ? new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeZone: "UTC" }).format(
        new Date(data.deletionRequest.requestedAt),
      )
    : null;

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="profile">{s.tabs.profile}</TabsTrigger>
        <TabsTrigger value="preferences">{s.tabs.preferences}</TabsTrigger>
        <TabsTrigger value="privacy">{s.tabs.privacy}</TabsTrigger>
        <TabsTrigger value="account">{s.tabs.account}</TabsTrigger>
      </TabsList>

      {/* ── PERFIL ── */}
      <TabsPanel value="profile">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{s.profile.title}</CardTitle>
              <CardDescription>{s.profile.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <form onSubmit={saveName} className="flex flex-col gap-3">
                <Input
                  label={s.profile.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  required
                />
                <Button type="submit" loading={savingName} className="self-start">
                  {s.common.save}
                </Button>
              </form>

              <form onSubmit={saveProfile} className="flex flex-col gap-3 border-t border-border/60 pt-4">
                <Select
                  label={s.profile.country}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {ONBOARDING_COUNTRIES.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {dict.onboarding.countries[entry.id] ?? entry.id}
                    </option>
                  ))}
                </Select>
                <Select
                  label={s.profile.language}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="es-MX">
                    Español (México) · {s.profile.languageActive}
                  </option>
                  <option value="pt-BR" disabled>
                    Português (Brasil) · {s.profile.languageSoon}
                  </option>
                  <option value="en-US" disabled>
                    English (US) · {s.profile.languageSoon}
                  </option>
                </Select>
                <Button type="submit" variant="secondary" loading={savingProfile} className="self-start">
                  {s.common.save}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{s.profile.email}</CardTitle>
              <CardDescription>{s.profile.emailDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 rounded-xl bg-background px-3.5 py-2.5 text-sm font-semibold text-text">
                {emailValue}
              </div>
              <form onSubmit={saveEmail} className="flex flex-col gap-3">
                {emailError ? <Alert variant="danger" title={emailError} /> : null}
                <Input
                  label={s.profile.newEmail}
                  type="email"
                  placeholder="tu@correo.mx"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  autoComplete="email"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  loading={savingEmail}
                  disabled={!newEmail.trim()}
                  className="self-start"
                >
                  {s.profile.changeEmail}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </TabsPanel>

      {/* ── PREFERÊNCIAS ── */}
      <TabsPanel value="preferences">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{s.preferences.theme.name}</CardTitle>
                <CardDescription>{s.preferences.theme.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void saveTheme("light")}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                    theme === "light"
                      ? "border-primary bg-primary text-primary-50"
                      : "border-border bg-surface text-muted hover:border-primary-300"
                  }`}
                >
                  {s.preferences.theme.light}
                </button>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-xl border border-dashed border-border-strong px-4 py-2.5 text-sm font-bold text-faint"
                  title={s.preferences.theme.soon}
                >
                  {s.preferences.theme.dark} · {s.preferences.theme.soon}
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{s.preferences.currencySection.name}</CardTitle>
                <CardDescription>{s.preferences.currencySection.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveCurrency} className="flex flex-col gap-3">
                  {currencyWarning ? (
                    <Alert
                      variant="warning"
                      title={s.preferences.currencySection.warningTitle}
                      description={s.preferences.currencySection.warningBody}
                    />
                  ) : null}
                  <Select
                    label={s.profile.currency}
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                      setCurrencyWarning(false);
                    }}
                  >
                    {Object.values(CURRENCIES).map((entry) => (
                      <option key={entry.code} value={entry.code}>
                        {entry.code} — {entry.label}
                      </option>
                    ))}
                  </Select>
                  {currencyWarning ? (
                    <Checkbox
                      label={s.preferences.currencySection.confirmLabel.replace("{currency}", currency)}
                      checked={currencyConfirm}
                      onCheckedChange={setCurrencyConfirm}
                    />
                  ) : null}
                  <Button
                    type="submit"
                    variant="secondary"
                    loading={savingCurrency}
                    disabled={
                      currency === data.baseCurrency || (currencyWarning && !currencyConfirm)
                    }
                    className="self-start"
                  >
                    {s.common.save}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{s.preferences.notificationsSection.name}</CardTitle>
                <CardDescription>{s.preferences.notificationsSection.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {NOTIFICATION_TYPES.map((type) => (
                  <Switch
                    key={type}
                    label={dict.notifications.types[type]}
                    checked={notifEnabled.has(type)}
                    onCheckedChange={(value) => {
                      setNotifEnabled((current) => {
                        const next = new Set(current);
                        if (value) next.add(type);
                        else next.delete(type);
                        return next;
                      });
                    }}
                  />
                ))}
                <Button variant="secondary" onClick={() => void saveNotifications()} className="self-start">
                  {s.common.save}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{s.preferences.dashboardSection.name}</CardTitle>
                <CardDescription>{s.preferences.dashboardSection.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {DASHBOARD_INDICATORS.map((indicator) => (
                  <Switch
                    key={indicator}
                    label={dict.dashboard.indicators[indicator as keyof typeof dict.dashboard.indicators]}
                    checked={dashVisible.has(indicator)}
                    onCheckedChange={(value) => {
                      setDashVisible((current) => {
                        const next = new Set(current);
                        if (value) next.add(indicator);
                        else next.delete(indicator);
                        return next;
                      });
                    }}
                  />
                ))}
                <Button variant="secondary" onClick={() => void saveDashboard()} className="self-start">
                  {s.common.save}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsPanel>

      {/* ── PRIVACIDADE ── */}
      <TabsPanel value="privacy">
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="flex items-start gap-3 pt-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success-soft text-success">
                <IconShield size={16} />
              </span>
              <div>
                <p className="text-sm font-bold text-text">{s.privacy.localModel.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{s.privacy.localModel.desc}</p>
                <Badge tone="success" className="mt-1.5">
                  <span className="flex items-center gap-1">
                    <IconSparkles size={11} /> {s.privacy.localModel.badge}
                  </span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-700">
                  <IconDownload size={16} />
                </span>
                <div>
                  <p className="text-sm font-bold text-text">{s.privacy.export.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{s.privacy.export.desc}</p>
                </div>
              </div>
              <Button variant="secondary" loading={busyPrivacy === "export"} onClick={() => void downloadExport()}>
                {s.privacy.export.action}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning">
                  <IconTrash size={16} />
                </span>
                <div>
                  <p className="text-sm font-bold text-text">{s.privacy.aiHistory.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {s.privacy.aiHistory.desc} ({data.aiConversations})
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-danger hover:bg-danger-soft"
                disabled={data.aiConversations === 0}
                onClick={() => setConfirmClearAi(true)}
              >
                {s.privacy.aiHistory.action}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-700">
                  <IconCheck size={16} />
                </span>
                <div>
                  <p className="text-sm font-bold text-text">{s.privacy.academy.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {s.privacy.academy.desc} · {data.academyDone} {dict.academia.done.toLowerCase()} ·{" "}
                    {data.academyFavorites} {dict.academia.filters.favorites.toLowerCase()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                disabled={data.academyDone === 0 && data.academyFavorites === 0}
                onClick={() => setConfirmResetAcademy(true)}
              >
                {s.privacy.academy.action}
              </Button>
            </CardContent>
          </Card>

          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-faint">
            <IconAlertTriangle size={13} className="mt-0.5 shrink-0 text-warning" />
            {s.privacy.dangerNote}
          </p>
        </div>
      </TabsPanel>

      {/* ── CONTA ── */}
      <TabsPanel value="account">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <IconLock size={15} className="text-primary-700" />
                {s.account.password.name}
              </CardTitle>
              <CardDescription>{s.account.password.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={savePassword} className="flex flex-col gap-3">
                {pwError ? <Alert variant="danger" title={pwError} /> : null}
                <Input
                  label={s.account.password.current}
                  type="password"
                  autoComplete="current-password"
                  value={pwCurrent}
                  onChange={(e) => setPwCurrent(e.target.value)}
                />
                <Input
                  label={s.account.password.next}
                  type="password"
                  autoComplete="new-password"
                  value={pwNext}
                  onChange={(e) => setPwNext(e.target.value)}
                />
                <Input
                  label={s.account.password.confirm}
                  type="password"
                  autoComplete="new-password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                />
                <Button type="submit" loading={savingPw} disabled={!pwCurrent || !pwNext || !pwConfirm} className="self-start">
                  {s.account.password.action}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                <div>
                  <p className="text-sm font-bold text-text">{s.account.sessions.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{s.account.sessions.desc}</p>
                </div>
                <Button variant="secondary" onClick={handleLogout}>
                  {s.account.logout.action}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-danger/30">
              <CardHeader>
                <CardTitle className="text-sm text-danger-strong">{s.account.deletion.name}</CardTitle>
                <CardDescription>{s.account.deletion.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                {data.deletionRequest ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge tone="warning" dot>
                        {s.account.deletion.statusPending}
                      </Badge>
                      <span className="text-xs text-muted">
                        {s.account.deletion.requestedAt.replace(
                          "{date}",
                          requestedDate ?? "—",
                        )}
                      </span>
                    </div>
                    <Button variant="secondary" loading={deletingBusy} onClick={() => void cancelDeletionRequest()}>
                      {s.account.deletion.cancel}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDeleteWord("");
                      setConfirmDelete(true);
                    }}
                  >
                    {s.account.deletion.request}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsPanel>

      {/* Diálogos de confirmação */}
      <ConfirmDialog
        open={confirmClearAi}
        onOpenChange={setConfirmClearAi}
        title={s.privacy.aiHistory.confirmTitle}
        description={s.privacy.aiHistory.confirmDesc}
        confirmLabel={s.privacy.aiHistory.confirmLabel}
        tone="danger"
        loading={busyPrivacy === "clear-ai"}
        icon={<IconTrash size={18} />}
        onConfirm={() => void privacyAction("clear-ai")}
      />
      <ConfirmDialog
        open={confirmResetAcademy}
        onOpenChange={setConfirmResetAcademy}
        title={s.privacy.academy.confirmTitle}
        description={s.privacy.academy.confirmDesc}
        confirmLabel={s.privacy.academy.confirmLabel}
        tone="danger"
        loading={busyPrivacy === "reset-academy"}
        icon={<IconTrash size={18} />}
        onConfirm={() => void privacyAction("reset-academy")}
      />
      {/* Solicitud de exclusión: confirmación explícita con palabra clave */}
      <Modal
        open={confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(false)}
        title={s.account.deletion.name}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)} disabled={deletingBusy}>
              {dict.presupuesto.form.cancel}
            </Button>
            <Button
              variant="danger"
              loading={deletingBusy}
              disabled={deleteWord !== s.account.deletion.word}
              onClick={() => void submitDeletion()}
            >
              {s.account.deletion.request}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3.5">
          <p className="flex items-start gap-2 rounded-xl bg-danger-soft p-3 text-xs leading-relaxed text-danger-strong">
            <IconAlertTriangle size={14} className="mt-0.5 shrink-0" />
            {s.account.deletion.desc}
          </p>
          <Input
            label={s.account.deletion.typeToConfirm.replace("{word}", s.account.deletion.word)}
            value={deleteWord}
            onChange={(e) => setDeleteWord(e.target.value)}
            placeholder={s.account.deletion.word}
            autoComplete="off"
          />
        </div>
      </Modal>
    </Tabs>
  );
}

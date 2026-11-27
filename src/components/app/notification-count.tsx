"use client";

import { useCallback, useEffect, useState } from "react";
import { useDictionary } from "@/lib/i18n";

/**
 * Contador de notificaciones sin leer (sidebar). Se refresca al montar y
 * al recuperar el foco de la ventana; sin polling para no saturar.
 */
export function NotificationCount() {
  const dict = useDictionary();
  const [count, setCount] = useState(0);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) return;
      const data = (await response.json()) as { unreadCount: number };
      setCount(data.unreadCount);
    } catch {
      // Sin red: el contador simplemente no se actualiza.
    }
  }, []);

  useEffect(() => {
    void load();
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  if (count <= 0) return null;

  return (
    <span
      aria-label={dict.notifications.unread.replace("{n}", String(count))}
      className="ml-auto grid h-4.5 min-w-4.5 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

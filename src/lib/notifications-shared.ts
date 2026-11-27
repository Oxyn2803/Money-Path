/**
 * Notificaciones (Etapa 20) — tipos y constantes compartidos
 * servidor/cliente. SIN dependencias de DB (seguro para el bundle cliente).
 */

export type NotificationType =
  | "future_receipt"
  | "due_date"
  | "installment"
  | "goal"
  | "debt"
  | "budget"
  | "emergency_fund"
  | "insight";

export const NOTIFICATION_TYPES: NotificationType[] = [
  "future_receipt",
  "due_date",
  "installment",
  "goal",
  "debt",
  "budget",
  "emergency_fund",
  "insight",
];

export function isNotificationType(value: string): value is NotificationType {
  return (NOTIFICATION_TYPES as string[]).includes(value);
}

export interface NotificationView {
  id: string;
  kind: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAtIso: string;
  timeAgo: string;
}

export interface NotificationsData {
  items: NotificationView[];
  unreadCount: number;
  enabledTypes: NotificationType[];
}

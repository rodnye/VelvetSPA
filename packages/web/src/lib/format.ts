import type {
  AppointmentStatus,
  ServiceCategory,
  SubscriptionStatus,
  UserRole,
} from './types';

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  faciales: 'Faciales',
  dermapen: 'Dermapen',
  masajes_corporales: 'Masajes corporales',
  depilacion: 'Depilación',
  corporales: 'Corporales',
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  employee: 'Empleada',
  client: 'Cliente',
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: 'Activa',
  cancelled: 'Cancelada',
  expired: 'Expirada',
};

export type BadgeTone =
  'velvet' | 'gold' | 'green' | 'amber' | 'red' | 'neutral';

export const APPOINTMENT_STATUS_TONES: Record<AppointmentStatus, BadgeTone> = {
  pending: 'amber',
  confirmed: 'green',
  completed: 'velvet',
  cancelled: 'red',
};

export const SUBSCRIPTION_STATUS_TONES: Record<SubscriptionStatus, BadgeTone> =
  {
    active: 'green',
    cancelled: 'red',
    expired: 'neutral',
  };

const currency = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD',
});

export function formatPrice(price: string | number): string {
  return currency.format(typeof price === 'string' ? parseFloat(price) : price);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function daysUntil(iso: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000),
  );
}

export type UserRole = 'admin' | 'employee' | 'client';

export type ServiceCategory =
  'faciales' | 'dermapen' | 'masajes_corporales' | 'depilacion' | 'corporales';

export type AppointmentStatus =
  'pending' | 'confirmed' | 'completed' | 'cancelled';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  category: ServiceCategory;
  durationMin: number;
  price: string;
  isActive: boolean;
  createdAt: string;
}

export interface Plan {
  id: number;
  name: string;
  description: string | null;
  price: string;
  durationDays: number;
  isActive: boolean;
  createdAt: string;
}

export interface Subscription {
  id: number;
  userId: number;
  planId: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface SubscriptionWithPlan {
  subscription: Subscription;
  plan: { id: number; name: string; price: string; durationDays: number };
}

export interface Appointment {
  id: number;
  userId: number;
  serviceId: number;
  scheduledAt: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
}

export interface MyAppointment {
  appointment: Appointment;
  service: { id: number; name: string; durationMin: number; price: string };
}

export interface FullAppointment {
  appointment: Appointment;
  service: { id: number; name: string };
  user: { id: number; name: string; email: string };
}

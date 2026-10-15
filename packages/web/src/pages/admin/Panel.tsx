import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CalendarClock,
  CalendarDays,
  Gem,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { formatDateTime } from '../../lib/format';
import type {
  FullAppointment,
  Service,
  SubscriptionWithPlan,
  User,
} from '../../lib/types';
import { Card, PageHeader, Spinner } from '../../components/ui';

export default function Panel() {
  const { token, user } = useAuth();

  const users = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => api<User[]>('/users', {}, token),
    enabled: !!token,
  });
  const citas = useQuery({
    queryKey: ['appointments', 'all'],
    queryFn: () => api<FullAppointment[]>('/appointments', {}, token),
    enabled: !!token,
  });
  const subs = useQuery({
    queryKey: ['subscriptions', 'all'],
    queryFn: () => api<SubscriptionWithPlan[]>('/subscriptions', {}, token),
    enabled: !!token,
  });
  const services = useQuery({
    queryKey: ['services', 'all'],
    queryFn: () => api<Service[]>('/services/all', {}, token),
    enabled: !!token,
  });

  const pending =
    citas.data?.filter((c) => c.appointment.status === 'pending').length ?? 0;
  const activeSubs =
    subs.data?.filter((s) => s.subscription.status === 'active').length ?? 0;
  const upcoming = (citas.data ?? [])
    .filter(
      (c) =>
        new Date(c.appointment.scheduledAt).getTime() >= Date.now() &&
        ['pending', 'confirmed'].includes(c.appointment.status),
    )
    .slice(0, 6);

  const stats = [
    {
      label: 'Usuarios registrados',
      value: users.data?.length ?? '—',
      icon: UsersRound,
      to: '/admin/usuarios',
    },
    {
      label: 'Citas pendientes',
      value: pending,
      icon: CalendarClock,
      to: '/admin/citas',
    },
    {
      label: 'Suscripciones activas',
      value: activeSubs,
      icon: Gem,
      to: '/admin/suscripciones',
    },
    {
      label: 'Servicios en catálogo',
      value: services.data?.length ?? '—',
      icon: Sparkles,
      to: '/admin/servicios',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <PageHeader
        title={`Hola, ${user?.name ?? 'equipo'}`}
        subtitle="Resumen general de VelvetSPA."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-velvet-50 text-velvet-600">
                <s.icon size={20} />
              </span>
              <div>
                <p className="font-display text-2xl font-semibold text-espresso-900">
                  {s.value}
                </p>
                <p className="text-xs text-espresso-500">{s.label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 mb-4 flex items-center gap-2 font-display text-xl font-semibold text-espresso-900">
        <CalendarDays size={20} className="text-velvet-600" />
        Próximas citas
      </h2>
      {citas.isPending ? (
        <Spinner />
      ) : upcoming.length === 0 ? (
        <p className="text-sm text-espresso-500">
          No hay citas próximas en la agenda.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {upcoming.map(({ appointment, service, user: client }) => (
            <Card
              key={appointment.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div>
                <p className="font-medium text-espresso-900">{service.name}</p>
                <p className="text-sm text-espresso-500">
                  {client.name} · {formatDateTime(appointment.scheduledAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  appointment.status === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {appointment.status === 'confirmed'
                  ? 'Confirmada'
                  : 'Pendiente'}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

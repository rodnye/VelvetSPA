import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  CalendarHeart,
  Crown,
  Feather,
  Hand,
  Leaf,
  Sparkles,
  Zap,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { CATEGORY_LABELS, formatPrice } from '../lib/format';
import type { Plan, Service, ServiceCategory } from '../lib/types';
import { Badge, Card, Spinner } from '../components/ui';

const CATEGORY_ICONS: Record<ServiceCategory, typeof Sparkles> = {
  faciales: Sparkles,
  dermapen: Zap,
  masajes_corporales: Hand,
  depilacion: Feather,
  corporales: Leaf,
};

export default function Landing() {
  const { user } = useAuth();
  const services = useQuery({
    queryKey: ['services'],
    queryFn: () => api<Service[]>('/services'),
  });
  const plans = useQuery({
    queryKey: ['plans'],
    queryFn: () => api<Plan[]>('/plans'),
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-velvet-100 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gold-100 blur-3xl" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-24 text-center md:py-32">
          <Badge tone="velvet">
            <span className="flex items-center gap-1.5">
              <CalendarHeart size={13} /> Reservas en línea
            </span>
          </Badge>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight font-medium text-espresso-900 md:text-7xl">
            Tu momento de <em className="text-velvet-600 italic">calma</em>{' '}
            comienza aquí
          </h1>
          <p className="mt-6 max-w-xl text-lg text-espresso-500">
            Faciales, masajes, dermapen y rituales corporales. Elige tu
            tratamiento, reserva tu horario y déjate cuidar.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={user?.role === 'client' ? '/app/citas' : '/servicios'}
              className="inline-flex items-center gap-2 rounded-full bg-velvet-600 px-7 py-3 font-medium text-white shadow-lg shadow-velvet-300/50 transition hover:bg-velvet-700"
            >
              Reservar cita <ArrowRight size={17} />
            </Link>
            <Link
              to="/servicios"
              className="rounded-full border border-espresso-300 px-7 py-3 font-medium text-espresso-800 transition hover:border-velvet-500 hover:text-velvet-600"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <h2 className="text-center font-display text-3xl font-semibold text-espresso-900">
          Rituales para cada necesidad
        </h2>
        <p className="mt-2 text-center text-espresso-500">
          Cinco líneas de tratamiento diseñadas para ti
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
          {(Object.entries(CATEGORY_LABELS) as [ServiceCategory, string][]).map(
            ([key, label]) => {
              const Icon = CATEGORY_ICONS[key];
              return (
                <Link
                  key={key}
                  to={`/servicios?categoria=${key}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-cream-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-velvet-300 hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-velvet-50 text-velvet-600 transition group-hover:bg-velvet-100">
                    <Icon size={22} />
                  </span>
                  <span className="text-sm font-medium text-espresso-800">
                    {label}
                  </span>
                </Link>
              );
            },
          )}
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold text-espresso-900">
                Servicios destacados
              </h2>
              <p className="mt-2 text-espresso-500">
                Una selección de nuestro catálogo
              </p>
            </div>
            <Link
              to="/servicios"
              className="hidden items-center gap-1 text-sm font-medium text-velvet-600 hover:underline md:inline-flex"
            >
              Ver todos <ArrowRight size={15} />
            </Link>
          </div>
          {services.isPending ? (
            <Spinner />
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {(services.data ?? []).slice(0, 6).map((s) => (
                <Card
                  key={s.id}
                  className="flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Badge tone="gold">{CATEGORY_LABELS[s.category]}</Badge>
                  <h3 className="font-display text-xl font-semibold text-espresso-900">
                    {s.name}
                  </h3>
                  <p className="line-clamp-2 grow text-sm text-espresso-500">
                    {s.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-cream-200 pt-4">
                    <span className="text-sm text-espresso-500">
                      {s.durationMin} min
                    </span>
                    <span className="font-display text-lg font-semibold text-velvet-600">
                      {formatPrice(s.price)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Planes */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <h2 className="text-center font-display text-3xl font-semibold text-espresso-900">
          Planes de membresía
        </h2>
        <p className="mt-2 text-center text-espresso-500">
          Bienestar continuo al mejor precio
        </p>
        {plans.isPending ? (
          <Spinner />
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {(plans.data ?? []).map((p, i) => (
              <Card
                key={p.id}
                className={`flex flex-col gap-4 p-7 ${
                  i === 1
                    ? 'border-velvet-300 bg-velvet-50 shadow-lg shadow-velvet-100'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-espresso-900">
                    {p.name}
                  </h3>
                  {i === 1 && (
                    <Badge tone="velvet">
                      <span className="flex items-center gap-1">
                        <Crown size={12} /> Popular
                      </span>
                    </Badge>
                  )}
                </div>
                <p className="grow text-sm text-espresso-500">
                  {p.description}
                </p>
                <div>
                  <span className="font-display text-3xl font-semibold text-espresso-900">
                    {formatPrice(p.price)}
                  </span>
                  <span className="ml-2 text-sm text-espresso-500">
                    / {p.durationDays} días
                  </span>
                </div>
                <Link
                  to="/planes"
                  className="rounded-full bg-espresso-900 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-espresso-800"
                >
                  Ver detalles
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA final */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-espresso-900 px-8 py-16 text-center text-white">
          <div className="pointer-events-none absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-velvet-600/30 blur-3xl" />
          <h2 className="relative font-display text-3xl font-medium md:text-4xl">
            Regálate un respiro
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-cream-200">
            Crea tu cuenta gratis y reserva tu primera cita en menos de un
            minuto.
          </p>
          <Link
            to={user ? '/servicios' : '/registro'}
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-velvet-600 px-8 py-3 font-medium transition hover:bg-velvet-500"
          >
            {user ? 'Explorar servicios' : 'Crear cuenta gratis'}
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}

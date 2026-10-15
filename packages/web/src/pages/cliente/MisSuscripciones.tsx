import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Gem } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import {
  daysUntil,
  formatDate,
  formatPrice,
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_TONES,
} from '../../lib/format';
import type { Subscription, SubscriptionWithPlan } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Spinner,
} from '../../components/ui';

export default function MisSuscripciones() {
  const { token } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();

  const subs = useQuery({
    queryKey: ['subscriptions', 'me'],
    queryFn: () => api<SubscriptionWithPlan[]>('/subscriptions/me', {}, token),
    enabled: !!token,
  });

  const cancel = useMutation({
    mutationFn: (id: number) =>
      api<Subscription>(
        `/subscriptions/${id}/cancel`,
        { method: 'PATCH' },
        token,
      ),
    onSuccess: () => {
      toast('Suscripción cancelada.');
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (err) => {
      toast(
        err instanceof ApiError
          ? err.message
          : 'No se pudo cancelar la suscripción',
        'error',
      );
    },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12">
      <PageHeader
        title="Mi plan"
        subtitle="Tu membresía VelvetSPA y su historial."
        action={
          <Link
            to="/planes"
            className="rounded-full bg-velvet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-velvet-700"
          >
            Ver planes
          </Link>
        }
      />

      {subs.isPending ? (
        <Spinner label="Cargando tu plan…" />
      ) : (subs.data ?? []).length === 0 ? (
        <EmptyState icon={<Gem size={36} />} title="No tienes suscripciones">
          Activa un plan de membresía y disfruta de beneficios exclusivos.{' '}
          <Link to="/planes" className="font-medium text-velvet-600 underline">
            Explorar planes
          </Link>
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-4">
          {(subs.data ?? []).map(({ subscription, plan }) => (
            <Card
              key={subscription.id}
              className={`flex flex-wrap items-center gap-4 p-6 ${
                subscription.status === 'active'
                  ? 'border-velvet-300 bg-velvet-50'
                  : ''
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-velvet-100 text-velvet-700">
                <Gem size={22} />
              </div>
              <div className="min-w-44 grow">
                <p className="font-display text-lg font-semibold text-espresso-900">
                  {plan.name}
                </p>
                <p className="text-sm text-espresso-500">
                  {formatPrice(plan.price)} · del{' '}
                  {formatDate(subscription.startDate)} al{' '}
                  {formatDate(subscription.endDate)}
                </p>
                {subscription.status === 'active' && (
                  <p className="mt-1 text-xs font-medium text-velvet-600">
                    Quedan {daysUntil(subscription.endDate)} días de vigencia
                  </p>
                )}
              </div>
              <Badge tone={SUBSCRIPTION_STATUS_TONES[subscription.status]}>
                {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
              </Badge>
              {subscription.status === 'active' && (
                <Button
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  disabled={cancel.isPending}
                  onClick={() => {
                    if (window.confirm('¿Cancelar tu suscripción activa?')) {
                      cancel.mutate(subscription.id);
                    }
                  }}
                >
                  Cancelar plan
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

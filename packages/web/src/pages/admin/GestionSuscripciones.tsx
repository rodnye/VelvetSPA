import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Gem } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import {
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

export default function GestionSuscripciones() {
  const { token, user } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();

  const subs = useQuery({
    queryKey: ['subscriptions', 'all'],
    queryFn: () => api<SubscriptionWithPlan[]>('/subscriptions', {}, token),
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
        err instanceof ApiError ? err.message : 'No se pudo cancelar',
        'error',
      );
    },
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12">
      <PageHeader
        title="Suscripciones"
        subtitle="Membresías activas e historial de todos los clientes."
      />

      {subs.isPending ? (
        <Spinner label="Cargando suscripciones…" />
      ) : (subs.data ?? []).length === 0 ? (
        <EmptyState
          icon={<Gem size={36} />}
          title="Todavía no hay suscripciones"
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-xs tracking-wide text-espresso-500 uppercase">
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Vigencia</th>
                <th className="px-5 py-3">Estado</th>
                {user?.role === 'admin' && (
                  <th className="px-5 py-3 text-right">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {(subs.data ?? []).map(({ subscription, plan }) => (
                <tr
                  key={subscription.id}
                  className="border-b border-cream-100 last:border-0 hover:bg-cream-50"
                >
                  <td className="px-5 py-3.5 text-espresso-800">
                    Usuario #{subscription.userId}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-espresso-900">{plan.name}</p>
                    <p className="text-xs text-espresso-500">
                      {formatPrice(plan.price)} · {plan.durationDays} días
                    </p>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-espresso-800">
                    {formatDate(subscription.startDate)} →{' '}
                    {formatDate(subscription.endDate)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge
                      tone={SUBSCRIPTION_STATUS_TONES[subscription.status]}
                    >
                      {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
                    </Badge>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-5 py-3.5 text-right">
                      {subscription.status === 'active' && (
                        <Button
                          variant="ghost"
                          className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                          disabled={cancel.isPending}
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Cancelar la suscripción #${subscription.id}?`,
                              )
                            ) {
                              cancel.mutate(subscription.id);
                            }
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

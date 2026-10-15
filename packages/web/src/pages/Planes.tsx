import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, Crown } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import { formatPrice } from '../lib/format';
import type { Plan, Subscription } from '../lib/types';
import { Badge, Button, Card, PageHeader, Spinner } from '../components/ui';

export default function Planes() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();

  const plans = useQuery({
    queryKey: ['plans'],
    queryFn: () => api<Plan[]>('/plans'),
  });

  const subscribe = useMutation({
    mutationFn: (planId: number) =>
      api<Subscription>(
        '/subscriptions',
        { method: 'POST', body: JSON.stringify({ planId }) },
        token,
      ),
    onSuccess: () => {
      toast('¡Suscripción activada! Disfruta tu plan.');
      qc.invalidateQueries({ queryKey: ['subscriptions', 'me'] });
      navigate('/app/suscripciones');
    },
    onError: (err) => {
      toast(
        err instanceof ApiError ? err.message : 'No se pudo activar el plan',
        'error',
      );
    },
  });

  const handleSubscribe = (planId: number) => {
    if (!user) {
      navigate('/login', { state: { from: '/planes' } });
      return;
    }
    subscribe.mutate(planId);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <PageHeader
        title="Planes de membresía"
        subtitle="Activa tu plan y disfruta de beneficios exclusivos durante todo su periodo de vigencia."
      />
      {plans.isPending ? (
        <Spinner label="Cargando planes…" />
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {(plans.data ?? []).map((p, i) => (
            <Card
              key={p.id}
              className={`flex flex-col gap-4 p-8 transition hover:-translate-y-1 hover:shadow-lg ${
                i === 1
                  ? 'border-velvet-300 bg-velvet-50 shadow-lg shadow-velvet-100'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold text-espresso-900">
                  {p.name}
                </h2>
                {i === 1 && (
                  <Badge tone="velvet">
                    <span className="flex items-center gap-1">
                      <Crown size={12} /> Popular
                    </span>
                  </Badge>
                )}
              </div>
              <p className="grow text-espresso-500">{p.description}</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold text-espresso-900">
                  {formatPrice(p.price)}
                </span>
              </div>
              <p className="flex items-center gap-2 text-sm text-espresso-500">
                <CalendarDays size={15} className="text-velvet-600" />
                Vigencia de {p.durationDays} días
              </p>
              <Button
                className="mt-2 w-full"
                disabled={subscribe.isPending}
                onClick={() => handleSubscribe(p.id)}
              >
                {user ? 'Suscribirme' : 'Crear cuenta para suscribirme'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock3 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { CATEGORY_LABELS, CATEGORIES, formatPrice } from '../lib/format';
import type { Service } from '../lib/types';
import { Button, Card, PageHeader, Spinner } from '../components/ui';

export default function Servicios() {
  const [params, setParams] = useSearchParams();
  const categoria = params.get('categoria') ?? '';
  const navigate = useNavigate();
  const { user } = useAuth();

  const services = useQuery({
    queryKey: ['services', categoria],
    queryFn: () =>
      api<Service[]>(
        categoria ? `/services?category=${categoria}` : '/services',
      ),
  });

  const reservar = (serviceId: number) => {
    if (!user) {
      navigate('/login', { state: { from: '/servicios' } });
      return;
    }
    if (user.role !== 'client') {
      navigate('/servicios');
      return;
    }
    navigate(`/app/citas?servicio=${serviceId}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <PageHeader
        title="Nuestros servicios"
        subtitle="Explora el catálogo completo y reserva el tratamiento perfecto para ti."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setParams({})}
          className={`cursor-pointer rounded-full px-4 py-2 text-sm transition ${
            categoria === ''
              ? 'bg-espresso-900 font-medium text-white'
              : 'border border-cream-300 text-espresso-700 hover:border-velvet-500'
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setParams({ categoria: cat })}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm transition ${
              categoria === cat
                ? 'bg-espresso-900 font-medium text-white'
                : 'border border-cream-300 text-espresso-700 hover:border-velvet-500'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {services.isPending ? (
        <Spinner label="Cargando servicios…" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(services.data ?? []).map((s) => (
            <Card
              key={s.id}
              className="flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-xs font-medium tracking-wide text-gold-500 uppercase">
                {CATEGORY_LABELS[s.category]}
              </span>
              <h3 className="font-display text-xl font-semibold text-espresso-900">
                {s.name}
              </h3>
              <p className="grow text-sm text-espresso-500">{s.description}</p>
              <div className="flex items-center gap-4 text-sm text-espresso-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} /> {s.durationMin} min
                </span>
                <span className="font-display text-lg font-semibold text-velvet-600">
                  {formatPrice(s.price)}
                </span>
              </div>
              <Button className="mt-1 w-full" onClick={() => reservar(s.id)}>
                Reservar
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

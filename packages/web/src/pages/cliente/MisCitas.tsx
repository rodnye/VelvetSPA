import { useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarHeart, CalendarX2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_TONES,
  formatDateTime,
  formatPrice,
} from '../../lib/format';
import type { Appointment, MyAppointment, Service } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBox,
  Field,
  Input,
  PageHeader,
  Select,
  Spinner,
  Textarea,
} from '../../components/ui';

export default function MisCitas() {
  const { token } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const preselected = Number(params.get('servicio')) || 0;

  const [serviceId, setServiceId] = useState<number>(preselected);
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const services = useQuery({
    queryKey: ['services'],
    queryFn: () => api<Service[]>('/services'),
  });

  const citas = useQuery({
    queryKey: ['appointments', 'me'],
    queryFn: () => api<MyAppointment[]>('/appointments/me', {}, token),
    enabled: !!token,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['appointments'] });

  const create = useMutation({
    mutationFn: () =>
      api<Appointment>(
        '/appointments',
        {
          method: 'POST',
          body: JSON.stringify({
            serviceId,
            scheduledAt: new Date(scheduledAt).toISOString(),
            ...(notes.trim() ? { notes: notes.trim() } : {}),
          }),
        },
        token,
      ),
    onSuccess: () => {
      toast('¡Cita reservada! Te esperamos.');
      setScheduledAt('');
      setNotes('');
      setServiceId(0);
      setError(null);
      invalidate();
    },
    onError: (err) => {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo crear la cita',
      );
    },
  });

  const cancel = useMutation({
    mutationFn: (id: number) =>
      api<Appointment>(
        `/appointments/${id}/status`,
        { method: 'PATCH', body: JSON.stringify({ status: 'cancelled' }) },
        token,
      ),
    onSuccess: () => {
      toast('Cita cancelada.');
      invalidate();
    },
    onError: (err) => {
      toast(
        err instanceof ApiError ? err.message : 'No se pudo cancelar la cita',
        'error',
      );
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    create.mutate();
  };

  const minDateTime = useMemo(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <PageHeader
        title="Mis citas"
        subtitle="Reserva nuevos tratamientos y gestiona tus próximas visitas."
      />

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <Card className="h-fit p-6 lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-espresso-900">
            <CalendarHeart size={20} className="text-velvet-600" />
            Nueva cita
          </h2>
          <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
            {error && <ErrorBox message={error} />}
            <Field label="Servicio">
              <Select
                required
                value={serviceId || ''}
                onChange={(e) => setServiceId(Number(e.target.value))}
              >
                <option value="" disabled>
                  Selecciona un servicio…
                </option>
                {(services.data ?? []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.durationMin} min · {formatPrice(s.price)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Fecha y hora">
              <Input
                type="datetime-local"
                required
                min={minDateTime}
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </Field>
            <Field label="Notas (opcional)">
              <Textarea
                value={notes}
                maxLength={1024}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Prefiero una cabina tranquila…"
              />
            </Field>
            <Button
              type="submit"
              disabled={create.isPending || !serviceId || !scheduledAt}
            >
              {create.isPending ? 'Reservando…' : 'Reservar cita'}
            </Button>
          </form>
        </Card>

        <div>
          {citas.isPending ? (
            <Spinner label="Cargando tus citas…" />
          ) : (citas.data ?? []).length === 0 ? (
            <EmptyState
              icon={<CalendarX2 size={36} />}
              title="Aún no tienes citas"
            >
              Reserva tu primera cita con el formulario y vive la experiencia
              Velvet.
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-4">
              {(citas.data ?? []).map(({ appointment, service }) => (
                <Card
                  key={appointment.id}
                  className="flex flex-wrap items-center gap-4 p-5"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-velvet-50 text-velvet-700">
                    <span className="text-lg leading-none font-semibold">
                      {new Date(appointment.scheduledAt).getDate()}
                    </span>
                    <span className="text-[10px] uppercase">
                      {new Date(appointment.scheduledAt).toLocaleString(
                        'es-ES',
                        { month: 'short' },
                      )}
                    </span>
                  </div>
                  <div className="min-w-40 grow">
                    <p className="font-medium text-espresso-900">
                      {service.name}
                    </p>
                    <p className="text-sm text-espresso-500">
                      {formatDateTime(appointment.scheduledAt)} ·{' '}
                      {service.durationMin} min · {formatPrice(service.price)}
                    </p>
                    {appointment.notes && (
                      <p className="mt-1 text-xs text-espresso-500 italic">
                        “{appointment.notes}”
                      </p>
                    )}
                  </div>
                  <Badge tone={APPOINTMENT_STATUS_TONES[appointment.status]}>
                    {APPOINTMENT_STATUS_LABELS[appointment.status]}
                  </Badge>
                  {(appointment.status === 'pending' ||
                    appointment.status === 'confirmed') && (
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      disabled={cancel.isPending}
                      onClick={() => cancel.mutate(appointment.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

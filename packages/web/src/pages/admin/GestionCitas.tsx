import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarX2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_TONES,
  formatDateTime,
} from '../../lib/format';
import type {
  Appointment,
  AppointmentStatus,
  FullAppointment,
} from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Select,
  Spinner,
} from '../../components/ui';

export default function GestionCitas() {
  const { token } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();
  const [filter, setFilter] = useState('');

  const citas = useQuery({
    queryKey: ['appointments', 'all'],
    queryFn: () => api<FullAppointment[]>('/appointments', {}, token),
    enabled: !!token,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
      api<Appointment>(
        `/appointments/${id}/status`,
        { method: 'PATCH', body: JSON.stringify({ status }) },
        token,
      ),
    onSuccess: () => {
      toast('Estado de la cita actualizado.');
      qc.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (err) => {
      toast(
        err instanceof ApiError ? err.message : 'No se pudo actualizar la cita',
        'error',
      );
    },
  });

  const rows = (citas.data ?? []).filter(
    (c) => !filter || c.appointment.status === filter,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <PageHeader
        title="Agenda de citas"
        subtitle="Confirma, completa o cancela las reservas del spa."
        action={
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-48"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </Select>
        }
      />

      {citas.isPending ? (
        <Spinner label="Cargando agenda…" />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<CalendarX2 size={36} />}
          title="No hay citas con este filtro"
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-xs tracking-wide text-espresso-500 uppercase">
                <th className="px-5 py-3">Fecha y hora</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Servicio</th>
                <th className="px-5 py-3">Notas</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ appointment, service, user: client }) => (
                <tr
                  key={appointment.id}
                  className="border-b border-cream-100 last:border-0 hover:bg-cream-50"
                >
                  <td className="px-5 py-3.5 whitespace-nowrap text-espresso-800">
                    {formatDateTime(appointment.scheduledAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-espresso-900">
                      {client.name}
                    </p>
                    <p className="text-xs text-espresso-500">{client.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-espresso-800">
                    {service.name}
                  </td>
                  <td className="max-w-44 px-5 py-3.5 text-xs text-espresso-500">
                    {appointment.notes ?? '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={APPOINTMENT_STATUS_TONES[appointment.status]}>
                      {APPOINTMENT_STATUS_LABELS[appointment.status]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      {appointment.status === 'pending' && (
                        <Button
                          variant="outline"
                          className="px-3 py-1.5 text-xs"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              id: appointment.id,
                              status: 'confirmed',
                            })
                          }
                        >
                          Confirmar
                        </Button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <Button
                          variant="outline"
                          className="px-3 py-1.5 text-xs"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              id: appointment.id,
                              status: 'completed',
                            })
                          }
                        >
                          Completar
                        </Button>
                      )}
                      {(appointment.status === 'pending' ||
                        appointment.status === 'confirmed') && (
                        <Button
                          variant="ghost"
                          className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              id: appointment.id,
                              status: 'cancelled',
                            })
                          }
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

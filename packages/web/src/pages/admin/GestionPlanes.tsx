import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import { formatPrice } from '../../lib/format';
import type { Plan } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  ErrorBox,
  Field,
  Input,
  Modal,
  PageHeader,
  Spinner,
  Textarea,
} from '../../components/ui';

interface FormState {
  name: string;
  description: string;
  price: string;
  durationDays: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  price: '45',
  durationDays: '30',
};

export default function GestionPlanes() {
  const { token } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const plans = useQuery({
    queryKey: ['plans', 'all'],
    queryFn: () => api<Plan[]>('/plans/all', {}, token),
    enabled: !!token,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['plans'] });

  const save = useMutation({
    mutationFn: () => {
      const body = JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
      });
      return editing
        ? api<Plan>(`/plans/${editing.id}`, { method: 'PATCH', body }, token)
        : api<Plan>('/plans', { method: 'POST', body }, token);
    },
    onSuccess: () => {
      toast(editing ? 'Plan actualizado.' : 'Plan creado.');
      setModal(false);
      invalidate();
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar');
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      api<Plan>(`/plans/${id}`, { method: 'DELETE' }, token),
    onSuccess: () => {
      toast('Plan desactivado.');
      invalidate();
    },
    onError: (err) => {
      toast(
        err instanceof ApiError ? err.message : 'No se pudo desactivar',
        'error',
      );
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setModal(true);
  };

  const openEdit = (p: Plan) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      durationDays: String(p.durationDays),
    });
    setError(null);
    setModal(true);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    save.mutate();
  };

  const set = (patch: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12">
      <PageHeader
        title="Gestión de planes"
        subtitle="Membresías disponibles para tus clientes."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Nuevo plan
          </Button>
        }
      />

      {plans.isPending ? (
        <Spinner label="Cargando planes…" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(plans.data ?? []).map((p) => (
            <Card key={p.id} className="flex flex-col gap-3 p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-espresso-900">
                  {p.name}
                </h3>
                <Badge tone={p.isActive ? 'green' : 'neutral'}>
                  {p.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <p className="grow text-sm text-espresso-500">{p.description}</p>
              <p className="text-sm text-espresso-800">
                <span className="font-display text-2xl font-semibold">
                  {formatPrice(p.price)}
                </span>{' '}
                · {p.durationDays} días de vigencia
              </p>
              <div className="flex justify-end gap-1 border-t border-cream-200 pt-3">
                <Button
                  variant="ghost"
                  className="px-3 py-1.5 text-xs"
                  onClick={() => openEdit(p)}
                >
                  <Pencil size={14} /> Editar
                </Button>
                {p.isActive && (
                  <Button
                    variant="ghost"
                    className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (window.confirm(`¿Desactivar el plan “${p.name}”?`)) {
                        remove.mutate(p.id);
                      }
                    }}
                  >
                    <Trash2 size={14} /> Desactivar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modal}
        title={editing ? 'Editar plan' : 'Nuevo plan'}
        onClose={() => setModal(false)}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && <ErrorBox message={error} />}
          <Field label="Nombre">
            <Input
              required
              minLength={2}
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </Field>
          <Field label="Descripción">
            <Textarea
              value={form.description}
              maxLength={1024}
              onChange={(e) => set({ description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio (USD)">
              <Input
                type="number"
                min={0}
                step="0.01"
                required
                value={form.price}
                onChange={(e) => set({ price: e.target.value })}
              />
            </Field>
            <Field label="Duración (días)">
              <Input
                type="number"
                min={1}
                required
                value={form.durationDays}
                onChange={(e) => set({ durationDays: e.target.value })}
              />
            </Field>
          </div>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Guardando…' : 'Guardar plan'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

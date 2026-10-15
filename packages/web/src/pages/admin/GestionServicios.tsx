import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import { CATEGORY_LABELS, CATEGORIES, formatPrice } from '../../lib/format';
import type { Service, ServiceCategory } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  ErrorBox,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  Spinner,
  Textarea,
} from '../../components/ui';

interface FormState {
  name: string;
  description: string;
  category: ServiceCategory;
  durationMin: string;
  price: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  category: 'faciales',
  durationMin: '30',
  price: '10',
};

export default function GestionServicios() {
  const { token } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const services = useQuery({
    queryKey: ['services', 'all'],
    queryFn: () => api<Service[]>('/services/all', {}, token),
    enabled: !!token,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['services'] });

  const save = useMutation({
    mutationFn: () => {
      const body = JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        category: form.category,
        durationMin: Number(form.durationMin),
        price: Number(form.price),
      });
      return editing
        ? api<Service>(
            `/services/${editing.id}`,
            { method: 'PATCH', body },
            token,
          )
        : api<Service>('/services', { method: 'POST', body }, token);
    },
    onSuccess: () => {
      toast(editing ? 'Servicio actualizado.' : 'Servicio creado.');
      setModal(false);
      invalidate();
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar');
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      api<Service>(`/services/${id}`, { method: 'DELETE' }, token),
    onSuccess: () => {
      toast('Servicio desactivado.');
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

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description ?? '',
      category: s.category,
      durationMin: String(s.durationMin),
      price: s.price,
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
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <PageHeader
        title="Gestión de servicios"
        subtitle="Crea, edita y desactiva tratamientos del catálogo."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Nuevo servicio
          </Button>
        }
      />

      {services.isPending ? (
        <Spinner label="Cargando servicios…" />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-xs tracking-wide text-espresso-500 uppercase">
                <th className="px-5 py-3">Servicio</th>
                <th className="px-5 py-3">Categoría</th>
                <th className="px-5 py-3">Duración</th>
                <th className="px-5 py-3">Precio</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(services.data ?? []).map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-cream-100 last:border-0 hover:bg-cream-50"
                >
                  <td className="max-w-64 px-5 py-3.5">
                    <p className="font-medium text-espresso-900">{s.name}</p>
                    <p className="truncate text-xs text-espresso-500">
                      {s.description}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone="gold">{CATEGORY_LABELS[s.category]}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-espresso-800">
                    {s.durationMin} min
                  </td>
                  <td className="px-5 py-3.5 font-medium text-espresso-900">
                    {formatPrice(s.price)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={s.isActive ? 'green' : 'neutral'}>
                      {s.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        className="cursor-pointer rounded-full p-2 text-espresso-500 hover:bg-cream-100 hover:text-velvet-600"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      {s.isActive && (
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Desactivar “${s.name}”? Dejará de mostrarse en el catálogo.`,
                              )
                            ) {
                              remove.mutate(s.id);
                            }
                          }}
                          className="cursor-pointer rounded-full p-2 text-espresso-500 hover:bg-red-50 hover:text-red-600"
                          aria-label="Desactivar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={modal}
        title={editing ? 'Editar servicio' : 'Nuevo servicio'}
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
          <Field label="Categoría">
            <Select
              value={form.category}
              onChange={(e) =>
                set({ category: e.target.value as ServiceCategory })
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duración (min)">
              <Input
                type="number"
                min={5}
                required
                value={form.durationMin}
                onChange={(e) => set({ durationMin: e.target.value })}
              />
            </Field>
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
          </div>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Guardando…' : 'Guardar servicio'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

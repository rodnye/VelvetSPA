import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import { formatDate, ROLE_LABELS } from '../../lib/format';
import type { User, UserRole } from '../../lib/types';
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
} from '../../components/ui';

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'client',
};

const ROLE_BADGE: Record<UserRole, 'velvet' | 'gold' | 'neutral'> = {
  admin: 'velvet',
  employee: 'gold',
  client: 'neutral',
};

export default function GestionUsuarios() {
  const { token, user: me } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const users = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => api<User[]>('/users', {}, token),
    enabled: !!token,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin'] });

  const create = useMutation({
    mutationFn: () =>
      api<User>(
        '/users',
        {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            ...(form.phone ? { phone: form.phone } : {}),
          }),
        },
        token,
      ),
    onSuccess: () => {
      toast('Usuario creado.');
      setModal(false);
      invalidate();
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear');
    },
  });

  const changeRole = useMutation({
    mutationFn: ({ id, role }: { id: number; role: UserRole }) =>
      api<User>(
        `/users/${id}`,
        { method: 'PATCH', body: JSON.stringify({ role }) },
        token,
      ),
    onSuccess: () => {
      toast('Rol actualizado.');
      invalidate();
    },
    onError: (err) => {
      toast(
        err instanceof ApiError ? err.message : 'No se pudo cambiar el rol',
        'error',
      );
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      api<{ deleted: boolean }>(`/users/${id}`, { method: 'DELETE' }, token),
    onSuccess: () => {
      toast('Usuario eliminado.');
      invalidate();
    },
    onError: (err) => {
      toast(
        err instanceof ApiError ? err.message : 'No se pudo eliminar',
        'error',
      );
    },
  });

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setError(null);
    setModal(true);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    create.mutate();
  };

  const set = (patch: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <PageHeader
        title="Gestión de usuarios"
        subtitle="Crea cuentas, asigna roles y administra el acceso."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Nuevo usuario
          </Button>
        }
      />

      {users.isPending ? (
        <Spinner label="Cargando usuarios…" />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-xs tracking-wide text-espresso-500 uppercase">
                <th className="px-5 py-3">Usuario</th>
                <th className="px-5 py-3">Teléfono</th>
                <th className="px-5 py-3">Rol</th>
                <th className="px-5 py-3">Registro</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(users.data ?? []).map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-cream-100 last:border-0 hover:bg-cream-50"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-espresso-900">{u.name}</p>
                    <p className="text-xs text-espresso-500">{u.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-espresso-800">
                    {u.phone ?? '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={ROLE_BADGE[u.role]}>
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-espresso-500">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        value={u.role}
                        disabled={u.id === me?.id || changeRole.isPending}
                        onChange={(e) =>
                          changeRole.mutate({
                            id: u.id,
                            role: e.target.value as UserRole,
                          })
                        }
                        className="w-36 px-2.5 py-1.5 text-xs"
                      >
                        <option value="client">Cliente</option>
                        <option value="employee">Empleada</option>
                        <option value="admin">Administrador</option>
                      </Select>
                      {u.id !== me?.id && (
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Eliminar a ${u.name}? Esta acción no se puede deshacer.`,
                              )
                            ) {
                              remove.mutate(u.id);
                            }
                          }}
                          className="cursor-pointer rounded-full p-2 text-espresso-500 hover:bg-red-50 hover:text-red-600"
                          aria-label="Eliminar"
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

      <Modal open={modal} title="Nuevo usuario" onClose={() => setModal(false)}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && <ErrorBox message={error} />}
          <Field label="Nombre completo">
            <Input
              required
              minLength={2}
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </Field>
          <Field label="Correo electrónico">
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
            />
          </Field>
          <Field label="Teléfono (opcional)">
            <Input
              value={form.phone}
              onChange={(e) => set({ phone: e.target.value })}
            />
          </Field>
          <Field label="Contraseña" hint="Mínimo 8 caracteres.">
            <Input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => set({ password: e.target.value })}
            />
          </Field>
          <Field label="Rol">
            <Select
              value={form.role}
              onChange={(e) => set({ role: e.target.value as UserRole })}
            >
              <option value="client">Cliente</option>
              <option value="employee">Empleada</option>
              <option value="admin">Administrador</option>
            </Select>
          </Field>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Creando…' : 'Crear usuario'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

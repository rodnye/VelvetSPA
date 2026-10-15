import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserRound } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import { formatDate, ROLE_LABELS } from '../../lib/format';
import type { User } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  ErrorBox,
  Field,
  Input,
  PageHeader,
} from '../../components/ui';

export default function MiPerfil() {
  const { user, token, setUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const update = useMutation({
    mutationFn: () =>
      api<User>(
        `/users/${user!.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            name,
            email,
            ...(phone ? { phone } : {}),
            ...(password ? { password } : {}),
          }),
        },
        token,
      ),
    onSuccess: (updated) => {
      setUser(updated);
      setPassword('');
      setError(null);
      toast('Perfil actualizado correctamente.');
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : 'No se pudo actualizar');
    },
  });

  if (!user) return null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    update.mutate();
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12">
      <PageHeader title="Mi perfil" subtitle="Gestiona tus datos personales." />

      <Card className="mb-6 flex items-center gap-4 p-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-velvet-100 text-velvet-700">
          <UserRound size={26} />
        </span>
        <div className="grow">
          <p className="font-display text-lg font-semibold text-espresso-900">
            {user.name}
          </p>
          <p className="text-sm text-espresso-500">
            Miembro desde {formatDate(user.createdAt)}
          </p>
        </div>
        <Badge tone="velvet">{ROLE_LABELS[user.role]}</Badge>
      </Card>

      <Card className="p-7">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && <ErrorBox message={error} />}
          <Field label="Nombre completo">
            <Input
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Correo electrónico">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Teléfono">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+5351234567"
            />
          </Field>
          <Field
            label="Nueva contraseña"
            hint="Déjalo vacío si no quieres cambiarla. Mínimo 8 caracteres."
          >
            <Input
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <Button type="submit" disabled={update.isPending} className="mt-2">
            {update.isPending ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

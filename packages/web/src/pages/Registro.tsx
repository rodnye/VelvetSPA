import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flower2 } from 'lucide-react';
import { ApiError } from '../lib/api';
import { useAuth } from '../lib/auth';
import { Button, Card, ErrorBox, Field, Input } from '../components/ui';

export default function Registro() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        ...(phone ? { phone } : {}),
      });
      navigate('/app/citas', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo crear la cuenta',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-5 py-16">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-velvet-600 text-white">
        <Flower2 size={26} />
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold text-espresso-900">
        Crea tu cuenta
      </h1>
      <p className="mt-2 text-sm text-espresso-500">
        Reserva citas y activa tu plan de bienestar.
      </p>

      <Card className="mt-8 w-full p-7">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && <ErrorBox message={error} />}
          <Field label="Nombre completo">
            <Input
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="María Pérez"
            />
          </Field>
          <Field label="Correo electrónico">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@example.com"
            />
          </Field>
          <Field label="Teléfono (opcional)">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+5351234567"
            />
          </Field>
          <Field label="Contraseña" hint="Mínimo 8 caracteres.">
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-sm text-espresso-500">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="font-medium text-velvet-600 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

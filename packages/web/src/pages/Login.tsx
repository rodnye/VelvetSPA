import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flower2 } from 'lucide-react';
import { ApiError } from '../lib/api';
import { useAuth } from '../lib/auth';
import { Button, Card, ErrorBox, Field, Input } from '../components/ui';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? '/app/citas';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo iniciar sesión',
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
        Bienvenida de vuelta
      </h1>
      <p className="mt-2 text-sm text-espresso-500">
        Inicia sesión para gestionar tus citas y tu plan.
      </p>

      <Card className="mt-8 w-full p-7">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && <ErrorBox message={error} />}
          <Field label="Correo electrónico">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@example.com"
            />
          </Field>
          <Field label="Contraseña">
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-sm text-espresso-500">
        ¿No tienes cuenta?{' '}
        <Link
          to="/registro"
          className="font-medium text-velvet-600 hover:underline"
        >
          Regístrate gratis
        </Link>
      </p>

      <div className="mt-8 w-full rounded-xl border border-cream-200 bg-cream-100/60 p-4 text-xs text-espresso-500">
        <p className="mb-1 font-medium text-espresso-700">
          Cuentas de demostración
        </p>
        <p>admin@velvetspa.com / admin1234</p>
        <p>empleada@velvetspa.com / empleada1234</p>
        <p>cliente@velvetspa.com / cliente1234</p>
      </div>
    </div>
  );
}

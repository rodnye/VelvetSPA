import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Flower2, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { ROLE_LABELS } from '../lib/format';

interface NavItem {
  to: string;
  label: string;
}

function navItemsFor(role: string | undefined): NavItem[] {
  if (role === 'admin') {
    return [
      { to: '/admin', label: 'Panel' },
      { to: '/admin/citas', label: 'Citas' },
      { to: '/admin/servicios', label: 'Servicios' },
      { to: '/admin/planes', label: 'Planes' },
      { to: '/admin/usuarios', label: 'Usuarios' },
      { to: '/admin/suscripciones', label: 'Suscripciones' },
    ];
  }
  if (role === 'employee') {
    return [
      { to: '/admin/citas', label: 'Agenda' },
      { to: '/admin/suscripciones', label: 'Suscripciones' },
      { to: '/servicios', label: 'Catálogo' },
    ];
  }
  if (role === 'client') {
    return [
      { to: '/', label: 'Inicio' },
      { to: '/servicios', label: 'Servicios' },
      { to: '/planes', label: 'Planes' },
      { to: '/app/citas', label: 'Mis citas' },
      { to: '/app/suscripciones', label: 'Mi plan' },
    ];
  }
  return [
    { to: '/', label: 'Inicio' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/planes', label: 'Planes' },
  ];
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1.5 text-sm transition ${
    isActive
      ? 'bg-velvet-100 font-medium text-velvet-700'
      : 'text-espresso-700 hover:text-velvet-600'
  }`;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = navItemsFor(user?.role);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Link
            to="/"
            className="flex items-center gap-2 text-espresso-900"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-velvet-600 text-white">
              <Flower2 size={18} />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">
              Velvet<span className="text-velvet-600">SPA</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} end className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  to="/app/perfil"
                  className="flex items-center gap-2 rounded-full border border-cream-300 px-3 py-1.5 text-sm text-espresso-800 transition hover:border-velvet-500"
                >
                  <UserRound size={15} className="text-velvet-600" />
                  <span className="max-w-32 truncate">{user.name}</span>
                  <span className="text-xs text-espresso-500">
                    {ROLE_LABELS[user.role]}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer rounded-full p-2 text-espresso-500 transition hover:bg-cream-100 hover:text-velvet-600"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-espresso-800 transition hover:text-velvet-600"
                >
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  className="rounded-full bg-espresso-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-espresso-800"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="cursor-pointer rounded-full p-2 text-espresso-800 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-cream-200 px-5 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <NavLink
                    to="/app/perfil"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                  >
                    Mi perfil
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="cursor-pointer rounded-full px-3 py-1.5 text-left text-sm text-red-600"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                  >
                    Entrar
                  </NavLink>
                  <NavLink
                    to="/registro"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                  >
                    Crear cuenta
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="grow">
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-cream-200 bg-cream-100/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2 text-espresso-900">
            <Flower2 size={18} className="text-velvet-600" />
            <span className="font-display text-lg font-semibold">
              VelvetSPA
            </span>
          </div>
          <p className="text-sm text-espresso-500">
            Estética · Masajes · Bienestar — reserva en línea tu momento de
            calma.
          </p>
          <p className="text-xs text-espresso-300">
            © {new Date().getFullYear()} VelvetSPA
          </p>
        </div>
      </footer>
    </div>
  );
}

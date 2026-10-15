import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { Loader2, X } from 'lucide-react';
import type { BadgeTone } from '../lib/format';

const BUTTON_VARIANTS = {
  primary:
    'bg-velvet-600 text-white hover:bg-velvet-700 shadow-sm disabled:opacity-50',
  outline:
    'border border-espresso-300 text-espresso-800 hover:border-velvet-500 hover:text-velvet-600 disabled:opacity-50',
  ghost: 'text-espresso-700 hover:bg-cream-100 disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
} as const;

type ButtonVariant = keyof typeof BUTTON_VARIANTS;

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

const fieldClass =
  'w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-espresso-900 placeholder:text-espresso-300 focus:border-velvet-500 focus:ring-2 focus:ring-velvet-100 focus:outline-none';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={fieldClass} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={fieldClass} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={fieldClass} rows={3} {...props} />;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-espresso-800">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs text-espresso-500">{hint}</span>
      )}
    </label>
  );
}

const BADGE_TONES: Record<BadgeTone, string> = {
  velvet: 'bg-velvet-100 text-velvet-700',
  gold: 'bg-gold-100 text-yellow-800',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  neutral: 'bg-cream-200 text-espresso-700',
};

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function Card({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-cream-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-espresso-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-espresso-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-espresso-500 hover:bg-cream-100"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Spinner({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-espresso-500">
      <Loader2 className="animate-spin" size={22} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  children,
}: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-cream-300 bg-cream-100/50 px-6 py-14 text-center">
      {icon && <div className="text-velvet-500">{icon}</div>}
      <p className="font-display text-lg text-espresso-800">{title}</p>
      {children && <div className="text-sm text-espresso-500">{children}</div>}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold text-espresso-900 md:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-espresso-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

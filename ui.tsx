'use client';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const Card = ({ className, ...p }: HTMLAttributes<HTMLDivElement>) => <div className={cn('glass rounded-2xl p-4 shadow-xl shadow-black/10', className)} {...p} />;
export const Button = ({ className, variant = 'primary', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) => (
  <button className={cn('inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-95 disabled:opacity-50',
    variant === 'primary' && 'bg-primary text-white hover:brightness-110', variant === 'ghost' && 'bg-fg/10 hover:bg-fg/20', variant === 'danger' && 'bg-red-500/15 text-red-500 hover:bg-red-500/25', className)} {...p} />
);
export const PageTitle = ({ children }: { children: ReactNode }) => <h1 className="mb-4 text-2xl font-bold">{children}</h1>;
export const Empty = ({ children }: { children: ReactNode }) => <p className="py-8 text-center text-sm text-fg/50">{children}</p>;
export function Ring({ value, size = 64, stroke = 7, color = 'rgb(var(--primary))', children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, v = Math.min(100, Math.max(0, value));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgb(var(--fg) / .12)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} style={{ transition: 'stroke-dashoffset .6s' }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-xs font-semibold">{children}</div>
    </div>
  );
}

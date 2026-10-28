import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
export const cn = (...a: ClassValue[]) => twMerge(clsx(a));
export const uid = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID().replace(/-/g, '').slice(0, 16) : Math.random().toString(36).slice(2, 10) + Date.now().toString(36));
export const dkey = (d: Date = new Date()) => format(d, 'yyyy-MM-dd');
export const isDay = (iso: string, day: string) => dkey(new Date(iso)) === day;

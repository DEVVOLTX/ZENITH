'use client';
import { useStore } from '@/lib/store';

export default function Avatar({ size = 36 }: { size?: number }) {
  const { name, avatar } = useStore((s) => s.settings);
  if (avatar) return <img src={avatar} alt={name || 'avatar'} className="rounded-full object-cover ring-2 ring-primary/60" style={{ width: size, height: size }} />;
  return <span className="grid place-items-center rounded-full bg-primary font-bold text-white" style={{ width: size, height: size, fontSize: size / 2.4 }}>{(name?.trim()[0] || 'Z').toUpperCase()}</span>;
}

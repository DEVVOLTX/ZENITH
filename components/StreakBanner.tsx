'use client';
import { motion } from 'framer-motion';
import { Flame, Share2 } from 'lucide-react';
import { useT } from '@/lib/i18n';

export default function StreakBanner({ n }: { n: number }) {
  const t = useT();
  return (
    <div className="relative mb-3 overflow-hidden rounded-3xl border border-fg/10 bg-black px-6 py-8 text-center text-white">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-[radial-gradient(70%_100%_at_50%_100%,#ff6a00,#ff3d0080_45%,transparent)]" />
      <motion.div animate={{ y: [0, -4, 0], scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} className="absolute bottom-2 end-4 text-orange-500"><Flame size={72} fill="currentColor" /></motion.div>
      <h2 className="relative text-2xl font-bold [text-shadow:0_0_18px_#fff8]">{t('onFire')}</h2>
      <p className="relative mx-auto mt-1 max-w-xs text-zinc-300">{n} {t('days')} {t('streakMsg')}</p>
      <button onClick={() => navigator.share?.({ title: 'Zenith', text: `${n} 🔥` })?.catch(() => {})} className="relative mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm backdrop-blur"><Share2 size={14} />{t('share')}</button>
    </div>
  );
}

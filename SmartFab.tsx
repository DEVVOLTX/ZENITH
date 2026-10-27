'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, CheckSquare, Flame, Target, StickyNote } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn, dkey } from '@/lib/utils';

const KINDS = [['note', StickyNote], ['goal', Target], ['habit', Flame], ['task', CheckSquare]] as const;

export default function SmartFab() {
  const { addTask, addHabit, addGoal, addNote, updateNote } = useStore(); const t = useT(); const router = useRouter();
  const [open, setOpen] = useState(false), [kind, setKind] = useState(''), [v, setV] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); const s = v.trim(); if (!s) return;
    if (kind === 'task') addTask({ title: s, dueDate: dkey() }); else if (kind === 'habit') addHabit({ name: s, icon: '⭐', color: '#7c3aed' });
    else if (kind === 'goal') addGoal({ title: s, target: 100 }); else { const id = addNote(); updateNote(id, { title: s }); router.push('/notes'); }
    setV(''); setKind('');
  };
  return (
    <>
      {kind && (
        <div className="fixed inset-0 z-50 grid items-end bg-black/50 p-3 md:place-items-center" onClick={() => setKind('')}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-4"><input autoFocus className="field" placeholder={`${t(kind)}…`} value={v} onChange={(e) => setV(e.target.value)} /></form>
        </div>
      )}
      <div className="fixed bottom-[5.25rem] end-4 z-40 flex flex-col items-end gap-2 md:bottom-6 md:end-6">
        <AnimatePresence>
          {open && KINDS.map(([k, I], n) => (
            <motion.button key={k} initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: n * 0.03 }}
              onClick={() => { setKind(k); setOpen(false); }} className="glass flex items-center gap-2 rounded-full py-2 ps-3 pe-4 text-sm shadow-xl"><I size={16} className="text-primary" />{t(k)}</motion.button>
          ))}
        </AnimatePresence>
        <button onClick={() => setOpen(!open)} aria-label={t('add')} className="grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-[0_0_28px_rgb(var(--primary)/.7)] transition active:scale-90"><Plus size={26} className={cn('transition', open && 'rotate-45')} /></button>
      </div>
    </>
  );
}

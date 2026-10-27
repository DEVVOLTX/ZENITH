'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn, dkey } from '@/lib/utils';

const ROUTES = [['/', 'dashboard'], ['/tasks', 'tasks'], ['/habits', 'habits'], ['/calendar', 'calendar'], ['/goals', 'goals'], ['/notes', 'notes'], ['/focus', 'focus'], ['/stats', 'stats'], ['/settings', 'settings']];
const KIND: Record<string, string> = { task: 'task', 'مهمة': 'task', habit: 'habit', 'عادة': 'habit', goal: 'goal', 'هدف': 'goal', note: 'note', 'ملاحظة': 'note' };

export default function CommandPalette() {
  const [open, setOpen] = useState(false), [q, setQ] = useState(''), [i, setI] = useState(0);
  const st = useStore(); const t = useT(); const router = useRouter();
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); } if (e.key === 'Escape') setOpen(false); };
    const o = () => setOpen(true);
    window.addEventListener('keydown', k); window.addEventListener('zenith:cmd', o);
    return () => { window.removeEventListener('keydown', k); window.removeEventListener('zenith:cmd', o); };
  }, []);
  if (!open) return null;
  const close = () => { setOpen(false); setQ(''); setI(0); };
  const make = (k: string, title: string) => {
    if (k === 'task') st.addTask({ title, dueDate: dkey() });
    else if (k === 'habit') st.addHabit({ name: title, icon: '⭐', color: '#7c3aed' });
    else if (k === 'goal') { const n = /(\d+(?:\.\d+)?)\s*$/.exec(title); st.addGoal({ title, target: n ? Number(n[1]) : 100 }); }
    else { const id = st.addNote(); st.updateNote(id, { title }); router.push('/notes'); }
    close();
  };
  const s = q.trim(); const acts: { label: string; run: () => void }[] = [];
  if (s) {
    const m = /^(?:(?:add|أضف|اضف)\s+)?(task|habit|goal|note|مهمة|عادة|هدف|ملاحظة)\s+(.+)$/i.exec(s);
    if (m) { const kind = KIND[m[1].toLowerCase()]; acts.push({ label: `${t('create')} ${t(kind)}: ${m[2]}`, run: () => make(kind, m[2]) }); }
    else acts.push({ label: `${t('create')} ${t('task')}: ${s}`, run: () => make('task', s) });
  }
  ROUTES.filter(([, k]) => !s || t(k).toLowerCase().includes(s.toLowerCase())).forEach(([h, k]) => acts.push({ label: `${t('go')} ${t(k)}`, run: () => { router.push(h); close(); } }));
  return (
    <div className="fixed inset-0 z-[70] bg-black/60 px-3 pt-[15vh]" onClick={close}>
      <div className="glass mx-auto max-w-lg overflow-hidden rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-fg/10 px-4"><Search size={16} className="text-fg/40" />
          <input autoFocus className="w-full bg-transparent py-3 text-sm outline-none" placeholder={t('cmdHint')} value={q} onChange={(e) => { setQ(e.target.value); setI(0); }}
            onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setI((i + 1) % acts.length); } else if (e.key === 'ArrowUp') { e.preventDefault(); setI((i - 1 + acts.length) % acts.length); } else if (e.key === 'Enter') acts[i]?.run(); }} /></div>
        <div className="max-h-72 overflow-y-auto p-1.5">{acts.map((a, n) => <button key={n} onClick={a.run} onMouseEnter={() => setI(n)} className={cn('block w-full rounded-xl px-3 py-2 text-start text-sm', n === i && 'bg-primary text-white')}>{a.label}</button>)}</div>
      </div>
    </div>
  );
}

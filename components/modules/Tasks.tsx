'use client';
import { useState } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, Trash2, Pencil, Plus, GripVertical, Timer as TimerIcon } from 'lucide-react';
import { useTimer } from '@/lib/timer';
import { useStore, type Task, type Priority } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn, dkey } from '@/lib/utils';
import { Card, Button, PageTitle, Empty } from '../ui';

export const PR: Record<Priority, string> = { low: '#64748b', med: '#3b82f6', high: '#f59e0b', urgent: '#ef4444' };
export const CATS = ['work', 'study', 'personal', 'health', 'other'];

function Form({ init, onSave, onCancel }: { init?: Task; onSave: (p: Partial<Task> & { title: string }) => void; onCancel: () => void }) {
  const t = useT();
  const [f, setF] = useState({ title: init?.title ?? '', description: init?.description ?? '', priority: (init?.priority ?? 'med') as Priority, category: init?.category ?? 'personal', dueDate: init?.dueDate ?? '', dueTime: init?.dueTime ?? '' });
  const set = (k: string, v: string) => setF({ ...f, [k]: v });
  return (
    <form className="grid gap-2 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); if (f.title.trim()) onSave({ ...f, title: f.title.trim(), dueDate: f.dueDate || undefined, dueTime: f.dueTime || undefined }); }}>
      <input className="field sm:col-span-2" autoFocus placeholder={t('title')} value={f.title} onChange={(e) => set('title', e.target.value)} />
      <input className="field sm:col-span-2" placeholder={t('description')} value={f.description} onChange={(e) => set('description', e.target.value)} />
      <select className="field" value={f.priority} onChange={(e) => set('priority', e.target.value)}>{(['low', 'med', 'high', 'urgent'] as const).map((p) => <option key={p} value={p}>{t(p)}</option>)}</select>
      <select className="field" value={f.category} onChange={(e) => set('category', e.target.value)}>{CATS.map((c) => <option key={c} value={c}>{t(c)}</option>)}</select>
      <input type="date" className="field" value={f.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
      <input type="time" className="field" value={f.dueTime} onChange={(e) => set('dueTime', e.target.value)} />
      <div className="flex gap-2"><Button>{t('save')}</Button><Button type="button" variant="ghost" onClick={onCancel}>{t('cancel')}</Button></div>
    </form>
  );
}

export default function Tasks() {
  const { tasks, addTask, updateTask, toggleTask, delTask, setTasks, query, setQuery } = useStore();
  const t = useT(); const today = dkey(); const router = useRouter();
  const [view, setView] = useState('all'), [pri, setPri] = useState('all'), [cat, setCat] = useState('all'), [adding, setAdding] = useState(false), [edit, setEdit] = useState('');
  const list = tasks.filter((x) => (view === 'all' || (view === 'today' && x.dueDate === today) || (view === 'overdue' && !x.completed && !!x.dueDate && x.dueDate < today))
    && (pri === 'all' || x.priority === pri) && (cat === 'all' || x.category === cat) && (!query || (x.title + x.description).toLowerCase().includes(query.toLowerCase())));
  const reorder = (n: Task[]) => { const ids = new Set(n.map((x) => x.id)); let i = 0; setTasks(tasks.map((x) => (ids.has(x.id) ? n[i++] : x))); };
  return (
    <div>
      <div className="flex items-center justify-between"><PageTitle>{t('tasks')}</PageTitle><Button onClick={() => setAdding(!adding)}><Plus size={16} />{t('newTask')}</Button></div>
      {adding && <Card className="mb-3"><Form onSave={(p) => { addTask(p); setAdding(false); }} onCancel={() => setAdding(false)} /></Card>}
      <div className="mb-3 flex flex-wrap gap-2">
        <input className="field max-w-xs" placeholder={t('search')} value={query} onChange={(e) => setQuery(e.target.value)} />
        {['all', 'today', 'overdue'].map((v) => <button key={v} onClick={() => setView(v)} className={cn('rounded-xl px-3 py-2 text-sm', view === v ? 'bg-primary text-white' : 'bg-fg/10')}>{t(v)}</button>)}
        <select className="field w-auto" value={pri} onChange={(e) => setPri(e.target.value)}><option value="all">{t('priority')}: {t('all')}</option>{(['low', 'med', 'high', 'urgent'] as const).map((p) => <option key={p} value={p}>{t(p)}</option>)}</select>
        <select className="field w-auto" value={cat} onChange={(e) => setCat(e.target.value)}><option value="all">{t('category')}: {t('all')}</option>{CATS.map((c) => <option key={c} value={c}>{t(c)}</option>)}</select>
      </div>
      {list.length === 0 && <Empty>{t('noTasks')}</Empty>}
      <Reorder.Group axis="y" values={list} onReorder={reorder} className="space-y-2">
        {list.map((x) => (
          <Reorder.Item key={x.id} value={x}>
            <Card className="border-s-4 p-3" style={{ borderInlineStartColor: PR[x.priority] }}>
              {edit === x.id ? <Form init={x} onSave={(p) => { updateTask(x.id, { dueDate: undefined, dueTime: undefined, ...p }); setEdit(''); }} onCancel={() => setEdit('')} /> : (
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="shrink-0 cursor-grab text-fg/30" />
                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleTask(x.id)} className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border-2', x.completed ? 'border-primary bg-primary text-white' : 'border-fg/30')} aria-label="toggle">
                    <AnimatePresence>{x.completed && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={14} /></motion.span>}</AnimatePresence>
                  </motion.button>
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-sm font-medium transition', x.completed && 'text-fg/40 line-through')}>{x.title}</p>
                    <p className="flex flex-wrap items-center gap-2 text-xs text-fg/50">
                      <span className="rounded-full px-2 py-0.5 text-white" style={{ background: PR[x.priority] }}>{t(x.priority)}</span><span>{t(x.category)}</span>
                      {x.dueDate && <span className={cn(!x.completed && x.dueDate < today && 'text-red-500')}>{x.dueDate}{x.dueTime && ` ${x.dueTime}`}</span>}{x.description && <span className="truncate">{x.description}</span>}
                    </p>
                  </div>
                  <button onClick={() => { const tm = useTimer.getState(); tm.setMode('focus'); tm.setTask(x.id); tm.start(); router.push('/focus'); }} className="rounded-lg p-1.5 hover:bg-fg/10" aria-label={t('focus')}><TimerIcon size={15} className="text-primary" /></button>
                  <button onClick={() => setEdit(x.id)} className="rounded-lg p-1.5 hover:bg-fg/10" aria-label="edit"><Pencil size={15} /></button>
                  <button onClick={() => delTask(x.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10" aria-label="delete"><Trash2 size={15} /></button>
                </div>
              )}
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

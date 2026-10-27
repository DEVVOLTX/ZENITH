'use client';
import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { Trash2, Plus, X, GripVertical } from 'lucide-react';
import { useStore, pct, type Goal } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn, uid } from '@/lib/utils';
import { Card, Button, PageTitle, Ring, Empty } from '../ui';

function GoalCard({ g }: { g: Goal }) {
  const { updateGoal, delGoal } = useStore(); const t = useT(); const [m, setM] = useState('');
  const setMs = (milestones: Goal['milestones']) => updateGoal(g.id, { milestones });
  return (
    <Card>
      <div className="flex items-center gap-4">
        <Ring value={pct(g)} size={80} stroke={8}>{pct(g)}%</Ring>
        <div className="min-w-0 flex-1">
          <input className="w-full bg-transparent text-lg font-semibold outline-none" defaultValue={g.title} onBlur={(e) => updateGoal(g.id, { title: e.target.value || g.title })} />
          <div className="mt-1 flex items-center gap-2 text-xs text-fg/60">
            {t('current')}<input type="number" className="field w-20 py-1" value={g.current} onChange={(e) => updateGoal(g.id, { current: Number(e.target.value) })} />
            {t('target')}<input type="number" min={1} className="field w-20 py-1" value={g.target} onChange={(e) => updateGoal(g.id, { target: Math.max(1, Number(e.target.value)) })} />
          </div>
        </div>
        <button onClick={() => delGoal(g.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10" aria-label="delete"><Trash2 size={16} /></button>
      </div>
      <input type="range" min={0} max={100} value={pct(g)} onChange={(e) => updateGoal(g.id, { current: Math.round((Number(e.target.value) * g.target) / 100) })} className="mt-3 w-full accent-[rgb(var(--primary))]" aria-label="progress" />
      <h3 className="mb-1 mt-2 text-sm font-medium">{t('milestones')}</h3>
      <Reorder.Group axis="y" values={g.milestones} onReorder={setMs} className="space-y-0.5">
        {g.milestones.map((x, i) => (
          <Reorder.Item key={x.id ?? x.title + i} value={x} className="flex cursor-grab items-center gap-2 rounded-lg py-1 active:cursor-grabbing">
            <GripVertical size={14} className="text-fg/30" />
            <input type="checkbox" checked={x.done} onChange={() => setMs(g.milestones.map((y, j) => (j === i ? { ...y, done: !y.done } : y)))} className="accent-[rgb(var(--primary))]" />
            <span className={cn('flex-1 text-sm', x.done && 'line-through opacity-50')}>{x.title}</span>
            <button onClick={() => setMs(g.milestones.filter((_, j) => j !== i))} aria-label="remove"><X size={14} className="text-fg/40" /></button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <form className="mt-1 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (m.trim()) { setMs([...g.milestones, { id: uid(), title: m.trim(), done: false }]); setM(''); } }}>
        <input className="field py-1.5" placeholder={t('addMilestone')} value={m} onChange={(e) => setM(e.target.value)} /><Button variant="ghost"><Plus size={16} /></Button>
      </form>
    </Card>
  );
}

export default function Goals() {
  const { goals, addGoal } = useStore(); const t = useT(); const [title, setTitle] = useState(''), [target, setTarget] = useState(100);
  const avg = goals.length ? Math.round(goals.reduce((a, g) => a + pct(g), 0) / goals.length) : 0;
  return (
    <div>
      <PageTitle>{t('goals')}</PageTitle>
      <Card className="mb-3">
        <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (title.trim()) { addGoal({ title: title.trim(), target: Math.max(1, target) }); setTitle(''); } }}>
          <input className="field min-w-40 flex-1" placeholder={t('newGoal')} value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="number" className="field w-28" min={1} value={target} onChange={(e) => setTarget(Number(e.target.value))} aria-label={t('target')} /><Button>{t('add')}</Button>
        </form>
      </Card>
      {goals.length > 0 && <Card className="mb-3 flex flex-col items-center gap-3 py-8"><Ring value={avg} size={200} stroke={16}><span className="text-4xl font-bold">{avg}%</span></Ring><p className="text-sm text-fg/60">{t('goalProgress')}</p></Card>}
      {goals.length === 0 && <Empty>{t('noGoals')}</Empty>}
      <div className="grid gap-3 lg:grid-cols-2">{goals.map((g) => <GoalCard key={g.id} g={g} />)}</div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useStore, type Task } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn, dkey } from '@/lib/utils';
import { Card, Button, PageTitle, Empty } from '../ui';
import { PR } from './Tasks';

export default function Calendar() {
  const { tasks, addTask, toggleTask, settings } = useStore(); const t = useT();
  const locale = settings.lang === 'ar' ? ar : enUS; const opt = { weekStartsOn: (settings.lang === 'ar' ? 6 : 0) as 0 | 6, locale };
  const [mode, setMode] = useState<'month' | 'week' | 'day'>('month'), [cur, setCur] = useState(new Date()), [sel, setSel] = useState(new Date()), [q, setQ] = useState('');
  const days = eachDayOfInterval(mode === 'month' ? { start: startOfWeek(startOfMonth(cur), opt), end: endOfWeek(endOfMonth(cur), opt) } : { start: startOfWeek(cur, opt), end: endOfWeek(cur, opt) });
  const move = (n: number) => { const c = mode === 'month' ? addMonths(cur, n) : mode === 'week' ? addWeeks(cur, n) : addDays(cur, n); setCur(c); if (mode === 'day') setSel(c); };
  const selTasks = tasks.filter((x) => x.dueDate === dkey(sel));
  return (
    <div>
      <PageTitle>{t('calendar')}</PageTitle>
      <Card className="relative overflow-hidden rounded-[2rem]">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(var(--primary)/.35),transparent)]" />
        <div className="mb-3 flex items-center gap-2">
          <button onClick={() => move(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-fg/15 hover:bg-fg/10" aria-label="prev"><ChevronLeft size={18} className="rtl:rotate-180" /></button>
          <h2 className="flex-1 text-center font-semibold">{format(cur, mode === 'day' ? 'EEE d MMMM yyyy' : 'MMMM yyyy', { locale })}</h2>
          <button onClick={() => move(1)} className="grid h-9 w-9 place-items-center rounded-full border border-fg/15 hover:bg-fg/10" aria-label="next"><ChevronRight size={18} className="rtl:rotate-180" /></button>
          {(['month', 'week', 'day'] as const).map((m) => <button key={m} onClick={() => { setMode(m); if (m === 'day') setCur(sel); }} className={cn('rounded-xl px-3 py-1.5 text-sm', mode === m ? 'bg-primary text-white' : 'bg-fg/10')}>{t(m)}</button>)}
        </div>
        {mode !== 'day' && <>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-fg/40">{days.slice(0, 7).map((d) => <div key={d.toISOString()}>{format(d, 'EEE', { locale })}</div>)}</div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((d) => {
            const dt = tasks.filter((x) => x.dueDate === dkey(d));
            return (
              <button key={d.toISOString()} onClick={() => setSel(d)} className={cn('flex flex-col items-center rounded-xl p-1.5 text-sm transition hover:bg-fg/10', mode === 'week' ? 'min-h-32 items-stretch' : 'min-h-14', !isSameMonth(d, cur) && mode === 'month' && 'opacity-25')}>
                <span className={cn('mx-auto grid h-9 w-9 place-items-center rounded-full text-base transition', isSameDay(d, sel) && 'bg-primary font-semibold text-white shadow-[0_0_18px_rgb(var(--primary)/.7)]', isSameDay(d, new Date()) && !isSameDay(d, sel) && 'font-bold text-primary')}>{format(d, 'd')}</span>
                {mode === 'month' ? <span className="mt-1 flex gap-0.5">{dt.slice(0, 3).map((x) => <i key={x.id} className="h-1.5 w-1.5 rounded-full" style={{ background: PR[x.priority] }} />)}</span>
                  : <span className="mt-1 space-y-1 text-start">{dt.slice(0, 4).map((x) => <span key={x.id} className={cn('block truncate rounded px-1 text-[10px] text-white', x.completed && 'opacity-50')} style={{ background: PR[x.priority] }}>{x.title}</span>)}</span>}
              </button>
            );
          })}
        </div>
        </>}
        {mode === 'day' && <Timeline date={cur} tasks={tasks} t={t} />}
      </Card>
      <Card className="mt-3">
        <h2 className="mb-2 font-semibold">{format(sel, 'EEEE, d MMMM', { locale })}</h2>
        <form className="mb-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) { addTask({ title: q.trim(), dueDate: dkey(sel) }); setQ(''); } }}>
          <input className="field" placeholder={t('quickAdd')} value={q} onChange={(e) => setQ(e.target.value)} /><Button>{t('add')}</Button>
        </form>
        {selTasks.length === 0 && <Empty>{t('noTasks')}</Empty>}
        {selTasks.map((x) => <label key={x.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-fg/10"><input type="checkbox" checked={x.completed} onChange={() => toggleTask(x.id)} className="accent-[rgb(var(--primary))]" /><i className="h-2 w-2 rounded-full" style={{ background: PR[x.priority] }} /><span className={cn('text-sm', x.completed && 'line-through opacity-50')}>{x.title}</span></label>)}
      </Card>
    </div>
  );
}

function Timeline({ date, tasks, t }: { date: Date; tasks: Task[]; t: (k: string) => string }) {
  const k = dkey(date), day = tasks.filter((x) => x.dueDate === k), now = new Date(), isToday = dkey(now) === k;
  const untimed = day.filter((x) => !x.dueTime);
  return (
    <div>
      {untimed.length > 0 && <div className="mb-3 flex flex-wrap items-center gap-2 text-xs"><span className="text-fg/50">{t('allDay')}</span>{untimed.map((x) => <span key={x.id} className="rounded-full px-3 py-1 text-white" style={{ background: PR[x.priority] }}>{x.title}</span>)}</div>}
      <div className="max-h-[32rem] overflow-y-auto">
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="relative flex min-h-12 gap-3 border-t border-fg/10 py-2">
            <span className="w-12 shrink-0 text-xs text-fg/40" dir="ltr">{String(h).padStart(2, '0')}:00</span>
            <div className="flex-1 space-y-1.5">
              {day.filter((x) => x.dueTime && parseInt(x.dueTime) === h).map((x) => (
                <div key={x.id} className="rounded-xl border-s-4 bg-fg/10 p-2 text-sm" style={{ borderInlineStartColor: PR[x.priority] }}>
                  <p className={cn(x.completed && 'line-through opacity-50')}>{x.title}</p><p className="text-xs text-fg/50" dir="ltr">{x.dueTime}</p>
                </div>
              ))}
            </div>
            {isToday && now.getHours() === h && <span className="pointer-events-none absolute inset-x-0 h-px bg-primary shadow-[0_0_8px_rgb(var(--primary))]" style={{ top: `${(now.getMinutes() / 60) * 100}%` }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

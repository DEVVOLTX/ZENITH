'use client';
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Flame, Timer, Circle, CheckCircle2, Share2, Sparkles } from 'lucide-react';
import { useTimer } from '@/lib/timer';
import { TemplatePicker } from '../Onboarding';
import { useStore, pct } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn, dkey, isDay } from '@/lib/utils';
import { subDays, startOfWeek, addDays } from 'date-fns';
import { Card, Ring, PageTitle, Button, Empty } from '../ui';
import StreakBanner from '../StreakBanner';

export default function Dashboard() {
  const { tasks, habits, goals, sessions, addTask, updateTask, toggleTask, toggleHabit, settings } = useStore();
  const t = useT(); const [q, setQ] = useState(''); const today = dkey(); const [sd, setSd] = useState(new Date()); const loc = settings.lang === 'ar' ? ar : enUS;
  const root = useRef<HTMLDivElement>(null); const tm = useTimer();
  const share = async () => {
    if (!root.current) return; const bg = `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()})`;
    const url = await toPng(root.current, { pixelRatio: 2, backgroundColor: bg, filter: (n) => !(n as HTMLElement).dataset?.noshare });
    const f = new File([await (await fetch(url)).blob()], 'zenith-progress.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f] }).catch(() => {}); else { const a = document.createElement('a'); a.href = url; a.download = f.name; a.click(); }
  };
  const list = dkey(sd) !== today ? tasks.filter((x) => x.dueDate === dkey(sd)).sort((a, b) => (a.dueTime ?? '99').localeCompare(b.dueTime ?? '99')).slice(0, 5) : tasks.filter((x) => !x.completed).sort((a, b) => Number(!(a.dueDate && a.dueDate <= today)) - Number(!(b.dueDate && b.dueDate <= today))).slice(0, 3);
  const doneToday = habits.filter((h) => h.completions.includes(today)).length;
  const focus = sessions.filter((s) => isDay(s.completedAt, today)).reduce((a, s) => a + s.duration, 0) + (tm.mode === 'focus' && tm.running ? Math.floor((tm.total - tm.left) / 60) : 0);
  const streak = Math.max(0, ...habits.map((h) => h.streak));
  const gp = goals.length ? Math.round(goals.reduce((a, g) => a + pct(g), 0) / goals.length) : 0;
  const score = (x: (typeof tasks)[number]) => ({ urgent: 40, high: 30, med: 15, low: 5 }[x.priority]) + (x.dueDate ? (x.dueDate < today ? 50 : x.dueDate === today ? 35 : 0) : 0);
  const plan = tasks.filter((x) => !x.completed).sort((a, b) => score(b) - score(a)).slice(0, 3);
  const last7 = (c: string[]) => Math.round((Array.from({ length: 7 }, (_, i) => dkey(subDays(new Date(), i))).filter((d) => c.includes(d)).length / 7) * 100);
  return (
    <div ref={root} className="relative pb-2">
      <button data-noshare onClick={share} className="absolute end-0 top-1 flex items-center gap-1.5 rounded-xl bg-fg/10 px-3 py-1.5 text-xs hover:bg-fg/20"><Share2 size={13} />{t('shareProgress')}</button>
      <PageTitle>{settings.name && <>{t('hello')} {settings.name} · </>}{t('summary')} <span className="text-sm font-normal text-fg/50">{format(new Date(), 'EEEE, d MMMM', { locale: settings.lang === 'ar' ? ar : enUS })}</span></PageTitle>
      {streak >= 3 && <StreakBanner n={streak} />}
      <div className="mb-3 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(new Date(), { weekStartsOn: settings.lang === 'ar' ? 6 : 0 }), i)).map((d) => {
          const on = dkey(d) === dkey(sd);
          return (
            <button key={d.toISOString()} onClick={() => setSd(d)} className={cn('flex flex-col items-center rounded-2xl py-2 text-xs transition', on ? 'bg-primary text-white shadow-[0_0_18px_rgb(var(--primary)/.6)]' : 'glass')}>
              <span className="opacity-70">{format(d, 'EEE', { locale: loc })}</span><span className="text-lg font-bold">{format(d, 'd')}</span>
            </button>
          );
        })}
      </div>
      {!tasks.length && !habits.length && !goals.length && <Card className="mb-3"><p className="mb-3 font-semibold">{t('useTemplate')}</p><TemplatePicker /></Card>}
      {plan.length > 0 && (
        <Card className="mb-3">
          <div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold"><Sparkles size={16} className="text-primary" />{t('plan')}</h2>
            <Button variant="ghost" data-noshare onClick={() => plan.forEach((x) => updateTask(x.id, { dueDate: today }))}>{t('planBtn')}</Button></div>
          <ol className="space-y-1 text-sm">{plan.map((x, i) => <li key={x.id} className="flex gap-2"><span className="text-fg/40">{i + 1}.</span>{x.title}</li>)}</ol>
        </Card>
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="flex items-center gap-3"><Flame className="text-orange-500" /><div><p className="text-2xl font-bold">{streak}</p><p className="text-xs text-fg/60">{t('streak')} · {t('days')}</p></div></Card>
        <Card className="flex items-center gap-3"><Timer className="text-primary" /><div><p className="text-2xl font-bold">{focus}</p><p className="text-xs text-fg/60">{t('focusToday')} · {t('min')}</p></div></Card>
        <Card className="flex items-center gap-3"><Ring value={habits.length ? (doneToday / habits.length) * 100 : 0} size={48} stroke={5}>{doneToday}/{habits.length}</Ring><p className="text-xs text-fg/60">{t('dailyTracking')}</p></Card>
        <Card className="flex items-center gap-3"><Ring value={gp} size={48} stroke={5}>{gp}%</Ring><p className="text-xs text-fg/60">{t('goalProgress')}</p></Card>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">{t('todayTasks')}</h2>
          <form className="mb-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) { addTask({ title: q.trim(), dueDate: dkey(sd) }); setQ(''); } }}>
            <input className="field" placeholder={t('quickAdd')} value={q} onChange={(e) => setQ(e.target.value)} /><Button>{t('add')}</Button>
          </form>
          {list.length === 0 && <Empty>{t('noTasks')}</Empty>}
          {list.map((x) => <button key={x.id} onClick={() => toggleTask(x.id)} className="flex w-full items-center gap-3 rounded-xl p-2 text-start hover:bg-fg/10">{x.completed ? <CheckCircle2 className="text-primary" size={20} /> : <Circle size={20} className="text-fg/40" />}<span className="text-sm">{x.title}</span>{x.dueTime && <span className="ms-auto text-xs text-fg/50" dir="ltr">{x.dueTime}</span>}</button>)}
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">{t('habitsProgress')}</h2>
          {habits.length === 0 && <Empty>{t('noHabits')}</Empty>}
          <div className="flex flex-wrap gap-4">
            {habits.map((h) => (
              <button key={h.id} onClick={() => toggleHabit(h.id)} className="flex flex-col items-center gap-1" title={h.name}>
                <Ring value={last7(h.completions)} color={h.color} size={60}><span className="text-lg">{h.icon}</span></Ring>
                <span className={`text-[11px] ${h.completions.includes(today) ? 'text-primary' : 'text-fg/50'}`}>{h.name}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">{t('goalProgress')}</h2>
          {goals.length === 0 ? <Empty>{t('noGoals')}</Empty> : goals.slice(0, 4).map((g) => (
            <div key={g.id} className="mb-3"><div className="mb-1 flex justify-between text-sm"><span>{g.title}</span><span className="text-fg/60">{pct(g)}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-fg/10"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct(g)}%` }} /></div></div>
          ))}
        </Card>
      </div>
    </div>
  );
}

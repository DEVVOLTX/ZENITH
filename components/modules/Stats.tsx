'use client';
import { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { addDays, endOfWeek, format, startOfWeek, subDays, subWeeks } from 'date-fns';
import { useStore, pct } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { dkey, isDay } from '@/lib/utils';
import { Card, PageTitle, Empty } from '../ui';

const P = 'rgb(var(--primary))'; const tick = { fill: 'rgb(var(--fg) / 0.6)', fontSize: 11 };
const tip = { contentStyle: { background: 'rgb(var(--card))', border: 'none', borderRadius: 12, color: 'rgb(var(--fg))' } };

export default function Stats() {
  const { tasks, habits, goals, sessions } = useStore(); const t = useT();
  const d = useMemo(() => {
    const weekly = Array.from({ length: 8 }, (_, i) => { const s = startOfWeek(subWeeks(new Date(), 7 - i)), e = endOfWeek(s); return { name: format(s, 'MMM d'), v: tasks.filter((x) => x.completedAt && new Date(x.completedAt) >= s && new Date(x.completedAt) <= e).length }; });
    const hab = Array.from({ length: 30 }, (_, i) => { const day = subDays(new Date(), 29 - i), k = dkey(day); return { name: format(day, 'd/M'), v: habits.length ? Math.round((habits.filter((h) => h.completions.includes(k)).length / habits.length) * 100) : 0 }; });
    const foc = Array.from({ length: 14 }, (_, i) => { const day = addDays(subDays(new Date(), 13), i), k = dkey(day); return { name: format(day, 'd/M'), v: +(sessions.filter((s) => isDay(s.completedAt, k)).reduce((a, s) => a + s.duration, 0) / 60).toFixed(2) }; });
    const status = [{ name: t('completed'), v: goals.filter((g) => pct(g) >= 100).length, c: '#10b981' }, { name: t('inProgress'), v: goals.filter((g) => pct(g) > 0 && pct(g) < 100).length, c: P }, { name: t('notStarted'), v: goals.filter((g) => pct(g) === 0).length, c: '#64748b' }].filter((x) => x.v > 0);
    const all = Array.from({ length: 30 }, (_, i) => { const day = subDays(new Date(), 29 - i), k = dkey(day); return { name: format(day, 'd/M'), tasks: tasks.filter((x) => x.completedAt && isDay(x.completedAt, k)).length, habits: habits.length ? Math.round((habits.filter((h) => h.completions.includes(k)).length / habits.length) * 100) : 0, focus: sessions.filter((s) => isDay(s.completedAt, k)).reduce((a, s) => a + s.duration, 0) }; });
    return { weekly, hab, foc, status, all };
  }, [tasks, habits, goals, sessions, t]);
  const box = (title: string, has: boolean, chart: React.ReactElement) => (
    <Card><h2 className="mb-3 font-semibold">{title}</h2>{has ? <div className="h-56" dir="ltr"><ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer></div> : <Empty>{t('noData')}</Empty>}</Card>
  );
  const grid = <CartesianGrid stroke="rgb(var(--fg) / 0.08)" vertical={false} />;
  return (
    <div>
      <PageTitle>{t('stats')}</PageTitle>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="lg:col-span-2">{box(t('overview'), tasks.some((x) => x.completedAt) || sessions.length > 0 || habits.some((h) => h.completions.length > 0),
          <ComposedChart data={d.all}><CartesianGrid stroke="rgb(var(--fg) / 0.08)" vertical={false} /><XAxis dataKey="name" tick={tick} interval={3} /><YAxis yAxisId="l" tick={tick} allowDecimals={false} /><YAxis yAxisId="r" orientation="right" domain={[0, 100]} tick={tick} /><Tooltip {...tip} /><Legend />
            <Area yAxisId="l" type="monotone" dataKey="focus" name={t('focus')} stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} /><Bar yAxisId="l" dataKey="tasks" name={t('tasks')} fill={P} radius={[6, 6, 0, 0]} /><Line yAxisId="r" type="monotone" dataKey="habits" name={t('habits') + ' %'} stroke="#10b981" strokeWidth={3} dot={false} /></ComposedChart>)}</div>
        {box(t('tasksPerWeek'), tasks.some((x) => x.completedAt), <BarChart data={d.weekly}>{grid}<XAxis dataKey="name" tick={tick} /><YAxis allowDecimals={false} tick={tick} /><Tooltip {...tip} /><Bar dataKey="v" fill={P} radius={[8, 8, 0, 0]} /></BarChart>)}
        {box(t('habitConsistency'), habits.some((h) => h.completions.length), <LineChart data={d.hab}>{grid}<XAxis dataKey="name" tick={tick} interval={4} /><YAxis domain={[0, 100]} tick={tick} /><Tooltip {...tip} /><Line type="monotone" dataKey="v" stroke={P} strokeWidth={3} dot={false} /></LineChart>)}
        {box(t('focusHours'), sessions.length > 0, <AreaChart data={d.foc}>{grid}<XAxis dataKey="name" tick={tick} interval={1} /><YAxis tick={tick} /><Tooltip {...tip} /><Area type="monotone" dataKey="v" stroke={P} fill={P} fillOpacity={0.3} /></AreaChart>)}
        {box(t('goalsStatus'), goals.length > 0, <PieChart><Pie data={d.status} dataKey="v" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>{d.status.map((s) => <Cell key={s.name} fill={s.c} />)}</Pie><Tooltip {...tip} /><Legend /></PieChart>)}
      </div>
    </div>
  );
}

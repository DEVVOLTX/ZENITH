'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Flame, CalendarDays, Target, StickyNote, Timer, BarChart3, Settings, Search, Palette, Languages, PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn, dkey } from '@/lib/utils';
import { primaryRgb } from '@/lib/colors';
import { useTimer } from '@/lib/timer';
import ColorPicker from './ColorPicker';
import Onboarding from './Onboarding';
import Avatar from './Avatar';
import SmartFab from './SmartFab';
import CommandPalette from './CommandPalette';

const NAV = [['/', 'dashboard', LayoutDashboard], ['/tasks', 'tasks', CheckSquare], ['/habits', 'habits', Flame], ['/calendar', 'calendar', CalendarDays], ['/goals', 'goals', Target],
  ['/notes', 'notes', StickyNote], ['/focus', 'focus', Timer], ['/stats', 'stats', BarChart3], ['/settings', 'settings', Settings]] as const;

export default function Shell({ children }: { children: ReactNode }) {
  const { ready, hydrate, settings, setSettings, query, setQuery, addTask } = useStore();
  const t = useT(); const path = usePathname(); const router = useRouter();
  const tm = useTimer(); const empty = useStore((s) => !s.tasks.length && !s.habits.length && !s.goals.length); const [qa, setQa] = useState(''); const [qaOpen, setQaOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); const [pop, setPop] = useState(false);

  useEffect(() => { hydrate(); if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') navigator.serviceWorker.register('/sw.js').catch(() => {}); }, [hydrate]);
  useEffect(() => {
    if (!ready) return; const r = document.documentElement;
    r.dataset.theme = settings.theme; r.lang = settings.lang; r.dir = settings.lang === 'ar' ? 'rtl' : 'ltr'; r.style.setProperty('--primary', primaryRgb(settings.color));
    try { localStorage.setItem('zenith-settings', JSON.stringify(settings)); } catch { /* ignore */ }
  }, [ready, settings]);

  if (!ready) return <div className="grid min-h-screen place-items-center text-2xl font-bold text-primary">Zenith</div>;
  const item = (h: string, k: string, I: typeof Settings, compact: boolean) => {
    const on = h === '/' ? path === '/' : path.startsWith(h);
    return (
      <Link key={h} href={h} title={t(k)} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition', on ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-fg/70 hover:bg-fg/10', compact && 'shrink-0 flex-col gap-0.5 px-3 py-1.5 text-[10px]')}>
        <I size={compact ? 20 : 18} />{(compact || !collapsed) && <span>{t(k)}</span>}
      </Link>
    );
  };
  return (
    <div className="min-h-screen">
      <aside className={cn('glass fixed inset-y-0 start-0 z-30 hidden flex-col gap-1 border-0 border-e p-3 md:flex', collapsed ? 'w-16' : 'w-56')}>
        <div className="mb-4 flex items-center justify-between px-1">{!collapsed && <span className="text-xl font-bold text-primary">Zenith</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="rounded-lg p-1.5 hover:bg-fg/10" aria-label="toggle sidebar">{collapsed ? <PanelLeftOpen size={18} className="rtl:rotate-180" /> : <PanelLeftClose size={18} className="rtl:rotate-180" />}</button></div>
        {NAV.map(([h, k, I]) => item(h, k, I, false))}
      </aside>
      <div className={cn(collapsed ? 'md:ps-16' : 'md:ps-56')}>
        <header className="glass sticky top-0 z-20 flex items-center gap-2 rounded-none border-0 border-b px-3 py-2.5 md:px-6">
          <span className="text-lg font-bold text-primary md:hidden">Zenith</span>
          <div className="relative ms-auto max-w-sm flex-1">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-fg/40" />
            <input className="field ps-9" placeholder={t('search')} value={query} onChange={(e) => { setQuery(e.target.value); if (e.target.value && !/^\/(tasks|notes)/.test(path)) router.push('/tasks'); }} />
          </div>
          <button onClick={() => window.dispatchEvent(new Event('zenith:cmd'))} className="hidden rounded-xl bg-fg/10 px-3 py-2 text-xs text-fg/60 hover:bg-fg/20 sm:block" aria-label="command palette">Ctrl K</button>
          <button onClick={() => setSettings({ lang: settings.lang === 'ar' ? 'en' : 'ar' })} className="flex items-center gap-1 rounded-xl bg-fg/10 px-3 py-2 text-sm hover:bg-fg/20" aria-label="language"><Languages size={16} />{settings.lang === 'ar' ? 'EN' : 'ع'}</button>
          <div className="relative">
            <button onClick={() => setPop(!pop)} className="rounded-xl bg-fg/10 p-2.5 hover:bg-fg/20" aria-label="theme"><Palette size={16} /></button>
            {pop && (
              <div className="glass absolute end-0 top-12 z-40 w-56 space-y-3 rounded-2xl p-3 shadow-2xl">
                <div className="grid grid-cols-3 gap-1.5">{(['light', 'dark', 'midnight'] as const).map((m) => <button key={m} onClick={() => setSettings({ theme: m })} className={cn('rounded-lg px-2 py-1.5 text-xs', settings.theme === m ? 'bg-primary text-white' : 'bg-fg/10')}>{t(m)}</button>)}</div>
                <ColorPicker />
              </div>
            )}
          </div>
          <Link href="/settings" aria-label={t('profile')}><Avatar size={36} /></Link>
        </header>
        <motion.main key={path} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl p-4 pb-28 md:p-6 md:pb-8">{children}</motion.main>
      </div>
      {tm.running && path !== '/focus' && (
        <Link href="/focus" className="fixed inset-x-0 top-16 z-40 mx-auto flex w-fit items-center gap-3 rounded-full bg-black px-3 py-1.5 text-sm font-semibold tabular-nums text-orange-400 shadow-xl" dir="ltr">
          <svg width="18" height="18" className="-rotate-90"><circle cx="9" cy="9" r="7" stroke="#ff9f0a" strokeWidth="3" fill="none" strokeDasharray="44" strokeDashoffset={44 * (1 - tm.left / tm.total)} /></svg>
          {String(Math.floor(tm.left / 60)).padStart(2, '0')}:{String(tm.left % 60).padStart(2, '0')}
        </Link>
      )}
      {!settings.onboarded && empty && <Onboarding />}
      <SmartFab />
      <CommandPalette />
      <nav className="glass fixed inset-x-3 bottom-3 z-30 flex gap-1 overflow-x-auto rounded-3xl p-1.5 shadow-2xl md:hidden">{NAV.map(([h, k, I]) => item(h, k, I, true))}</nav>
    </div>
  );
}

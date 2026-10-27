import { create } from 'zustand';
import { subDays, parseISO, differenceInCalendarDays } from 'date-fns';
import { dbGet, dbSet } from './db';
import { dkey, uid } from './utils';
import { buildSample } from './templates';

export type Priority = 'low' | 'med' | 'high' | 'urgent';
export interface Task { id: string; title: string; description: string; priority: Priority; category: string; dueDate?: string; dueTime?: string; completed: boolean; createdAt: string; completedAt?: string }
export interface Habit { id: string; name: string; icon: string; color: string; streak: number; completions: string[]; frozen?: string[] }
export interface Goal { id: string; title: string; target: number; current: number; milestones: { id?: string; title: string; done: boolean }[] }
export interface Note { id: string; title: string; content: string; pinned: boolean; tags: string[]; updatedAt: string }
export interface FocusSession { id: string; duration: number; completedAt: string; taskId?: string }
export interface Data { tasks: Task[]; habits: Habit[]; goals: Goal[]; notes: Note[]; sessions: FocusSession[] }
export interface Settings { theme: 'light' | 'dark' | 'midnight'; color: string; lang: 'ar' | 'en'; onboarded?: boolean; name?: string; avatar?: string }

export const calcStreak = (c: string[], fz: string[] = []) => {
  const s = new Set(c), f = new Set(fz); let d = new Date(); if (!s.has(dkey(d))) d = subDays(d, 1);
  let n = 0; while (s.has(dkey(d)) || f.has(dkey(d))) { if (s.has(dkey(d))) n++; d = subDays(d, 1); } return n;
};
export const bestStreak = (c: string[]) => {
  const a = [...c].sort(); let best = 0, run = 0;
  a.forEach((x, i) => { run = i && differenceInCalendarDays(parseISO(x), parseISO(a[i - 1])) === 1 ? run + 1 : 1; best = Math.max(best, run); });
  return best;
};
export const pct = (g: Goal) => (g.target ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0);

const DEF: Settings = { theme: 'midnight', color: 'violet', lang: 'en' };
const EMPTY: Data = { tasks: [], habits: [], goals: [], notes: [], sessions: [] };
const upd = <T extends { id: string }>(a: T[], id: string, p: Partial<T>) => a.map((x) => (x.id === id ? { ...x, ...p } : x));

interface S extends Data {
  settings: Settings; ready: boolean; query: string;
  hydrate(): Promise<void>; setSettings(p: Partial<Settings>): void; setQuery(q: string): void;
  addTask(t: Partial<Task> & { title: string }): void; updateTask(id: string, p: Partial<Task>): void; toggleTask(id: string): void; delTask(id: string): void; setTasks(t: Task[]): void;
  addHabit(h: { name: string; icon: string; color: string }): void; toggleHabit(id: string, date?: string): void; delHabit(id: string): void;
  addGoal(g: { title: string; target: number }): void; updateGoal(id: string, p: Partial<Goal>): void; delGoal(id: string): void;
  addNote(): string; updateNote(id: string, p: Partial<Note>): void; delNote(id: string): void;
  addSession(s: { duration: number; taskId?: string }): void;
  addData(d: Partial<Data>): void; loadSample(lang: string): void; clearSample(): void; freezeHabit(id: string): void;
  importData(d: Partial<Data> & { settings?: Settings }): void; clearAll(): void;
}

export const useStore = create<S>((set) => ({
  ...EMPTY, settings: DEF, ready: false, query: '',
  async hydrate() {
    let d: any = await dbGet('state');
    if (!d) { try { d = JSON.parse(localStorage.getItem('zenith-backup') || 'null'); } catch { /* ignore */ } }
    let st: any = null; try { st = JSON.parse(localStorage.getItem('zenith-settings') || 'null'); } catch { /* ignore */ }
    const settings = { ...DEF, lang: navigator.language.startsWith('ar') ? 'ar' : 'en', ...(d?.settings || {}), ...(st || {}) } as Settings;
    set({ ...EMPTY, ...(d || {}), settings, ready: true });
  },
  setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
  setQuery: (q) => set({ query: q }),
  addTask: (t) => set((s) => ({ tasks: [{ id: uid(), description: '', priority: 'med', category: 'personal', completed: false, createdAt: new Date().toISOString(), ...t } as Task, ...s.tasks] })),
  updateTask: (id, p) => set((s) => ({ tasks: upd(s.tasks, id, p) })),
  toggleTask: (id) => set((s) => ({ tasks: s.tasks.map((x) => x.id === id ? { ...x, completed: !x.completed, completedAt: x.completed ? undefined : new Date().toISOString() } : x) })),
  delTask: (id) => set((s) => ({ tasks: s.tasks.filter((x) => x.id !== id) })),
  setTasks: (tasks) => set({ tasks }),
  addHabit: (h) => set((s) => ({ habits: [...s.habits, { id: uid(), streak: 0, completions: [], ...h }] })),
  toggleHabit: (id, date = dkey()) => set((s) => ({ habits: s.habits.map((h) => { if (h.id !== id) return h; const c = h.completions.includes(date) ? h.completions.filter((x) => x !== date) : [...h.completions, date]; return { ...h, completions: c, streak: calcStreak(c, h.frozen) }; }) })),
  delHabit: (id) => set((s) => ({ habits: s.habits.filter((x) => x.id !== id) })),
  addGoal: (g) => set((s) => ({ goals: [...s.goals, { id: uid(), current: 0, milestones: [], ...g }] })),
  updateGoal: (id, p) => set((s) => ({ goals: upd(s.goals, id, p) })),
  delGoal: (id) => set((s) => ({ goals: s.goals.filter((x) => x.id !== id) })),
  addNote: () => { const n: Note = { id: uid(), title: '', content: '', pinned: false, tags: [], updatedAt: new Date().toISOString() }; set((s) => ({ notes: [n, ...s.notes] })); return n.id; },
  updateNote: (id, p) => set((s) => ({ notes: upd(s.notes, id, { ...p, updatedAt: new Date().toISOString() }) })),
  delNote: (id) => set((s) => ({ notes: s.notes.filter((x) => x.id !== id) })),
  addSession: (x) => set((s) => ({ sessions: [...s.sessions, { id: uid(), completedAt: new Date().toISOString(), ...x }] })),
  importData: (d) => set((s) => ({ ...EMPTY, ...d, settings: d.settings ? { ...s.settings, ...d.settings } : s.settings })),
  clearAll: () => set({ ...EMPTY }),
  addData: (d) => set((s) => ({ tasks: [...(d.tasks || []), ...s.tasks], habits: [...s.habits, ...(d.habits || [])], goals: [...s.goals, ...(d.goals || [])], notes: [...(d.notes || []), ...s.notes], sessions: [...s.sessions, ...(d.sessions || [])] })),
  clearSample: () => set((s) => { const k = (x: { id: string }) => !x.id.startsWith('demo_'); return { tasks: s.tasks.filter(k), habits: s.habits.filter(k), goals: s.goals.filter(k), notes: s.notes.filter(k), sessions: s.sessions.filter(k) }; }),
  loadSample: (lang) => { useStore.getState().clearSample(); useStore.getState().addData(buildSample(lang)); },
  freezeHabit: (id) => set((s) => ({ habits: s.habits.map((h) => { if (h.id !== id) return h; const y = dkey(subDays(new Date(), 1)), fz = h.frozen || []; if (h.completions.includes(y) || fz.includes(y) || fz.filter((x) => x.startsWith(y.slice(0, 7))).length >= 2) return h; const nf = [...fz, y]; return { ...h, frozen: nf, streak: calcStreak(h.completions, nf) }; }) })),
}));

if (typeof window !== 'undefined') {
  let h: ReturnType<typeof setTimeout>;
  useStore.subscribe((s) => {
    if (!s.ready) return; clearTimeout(h);
    h = setTimeout(() => {
      const d = { tasks: s.tasks, habits: s.habits, goals: s.goals, notes: s.notes, sessions: s.sessions, settings: s.settings };
      dbSet('state', d); try { localStorage.setItem('zenith-backup', JSON.stringify(d)); } catch { /* quota */ }
    }, 250);
  });
}

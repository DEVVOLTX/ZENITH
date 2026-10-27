import { subDays } from 'date-fns';
import { dkey, uid } from './utils';
import { calcStreak, type Data, type Habit, type Priority, type Task } from './store';

type L = [string, string];
const pick = (l: L, lang: string) => (lang === 'ar' ? l[1] : l[0]);
interface Tpl { label: L; icon: string; tasks: [L, string, Priority][]; habits: [L, string, string][]; goal: [L, number, L[]] }

export const TPL: Record<string, Tpl> = {
  student: { label: ['Student', 'طالب'], icon: '🎓',
    tasks: [[['Review today’s lecture notes', 'مراجعة ملاحظات محاضرة اليوم'], 'study', 'high'], [['Finish assignment draft', 'إنهاء مسودة الواجب'], 'study', 'urgent'], [['Plan the weekly study schedule', 'تخطيط جدول المذاكرة الأسبوعي'], 'personal', 'med']],
    habits: [[['Study for 1 hour', 'مذاكرة ساعة'], '📚', '#7c3aed'], [['Drink water', 'شرب الماء'], '💧', '#06b6d4']],
    goal: [['Finish the semester strong', 'إنهاء الفصل بتفوق'], 100, [['Midterms done', 'إنهاء الميدتيرم'], ['Projects submitted', 'تسليم المشاريع'], ['Final exams', 'الامتحانات النهائية']]] },
  employee: { label: ['Employee', 'موظف'], icon: '💼',
    tasks: [[['Reply to pending emails', 'الرد على الإيميلات المعلقة'], 'work', 'med'], [['Prepare the weekly report', 'تجهيز التقرير الأسبوعي'], 'work', 'high'], [['Pick top 3 priorities for the week', 'تحديد أهم 3 أولويات للأسبوع'], 'work', 'med']],
    habits: [[['Plan the day each morning', 'تخطيط اليوم كل صباح'], '✍️', '#3b82f6'], [['Walk 20 minutes', 'المشي 20 دقيقة'], '🏃', '#10b981']],
    goal: [['Hit the quarterly objective', 'تحقيق هدف الربع'], 100, [['Kickoff done', 'بدء التنفيذ'], ['Mid-quarter review', 'مراجعة منتصف الربع'], ['Delivered', 'التسليم']]] },
  freelancer: { label: ['Freelancer', 'فريلانسر'], icon: '🧑‍💻',
    tasks: [[['Send a proposal to a new client', 'إرسال عرض لعميل جديد'], 'work', 'high'], [['Invoice finished work', 'إصدار فاتورة للعمل المنتهي'], 'work', 'urgent'], [['Add a recent project to the portfolio', 'إضافة مشروع حديث للبورتفوليو'], 'personal', 'med']],
    habits: [[['2-hour deep work block', 'جلسة عمل عميق ساعتين'], '💻', '#7c3aed'], [['Reach out to one lead', 'التواصل مع عميل محتمل'], '📨', '#f59e0b']],
    goal: [['Land 3 new clients', 'الحصول على 3 عملاء جدد'], 3, [['First reply', 'أول رد'], ['Call booked', 'حجز مكالمة'], ['Contract signed', 'توقيع العقد']]] },
};
const EXTRA: Record<string, { task: [L, string, Priority]; habit: [L, string, string] }> = {
  focus: { task: [['Run your first focus session', 'ابدأ أول جلسة تركيز'], 'personal', 'med'], habit: [['One 25-minute focus session', 'جلسة تركيز 25 دقيقة'], '🎯', '#f43f5e'] },
  consistency: { task: [['Pick one habit to track daily', 'اختر عادة واحدة لتتبعها يوميًا'], 'personal', 'med'], habit: [['Daily check-in', 'مراجعة يومية'], '✅', '#10b981'] },
  planning: { task: [['Plan tomorrow tonight', 'خطط ليوم الغد الليلة'], 'personal', 'med'], habit: [['Evening review', 'مراجعة المساء'], '🌙', '#3b82f6'] },
};
const mkTask = (title: string, category: string, priority: Priority, dueDate?: string): Task => ({ id: uid(), title, description: '', priority, category, dueDate, completed: false, createdAt: new Date().toISOString() });
const mkHabit = (name: string, icon: string, color: string): Habit => ({ id: uid(), name, icon, color, streak: 0, completions: [] });
const E: Data = { tasks: [], habits: [], goals: [], notes: [], sessions: [] };

export function buildTemplate(key: string, lang: string): Data {
  const t = TPL[key], today = dkey();
  return { ...E, tasks: t.tasks.map(([n, c, p], i) => mkTask(pick(n, lang), c, p, i < 2 ? today : undefined)), habits: t.habits.map(([n, i, c]) => mkHabit(pick(n, lang), i, c)),
    goals: [{ id: uid(), title: pick(t.goal[0], lang), target: t.goal[1], current: 0, milestones: t.goal[2].map((m) => ({ id: uid(), title: pick(m, lang), done: false })) }] };
}
export function buildExtra(kind: string, lang: string): Data {
  const x = EXTRA[kind]; if (!x) return E;
  return { ...E, tasks: [mkTask(pick(x.task[0], lang), x.task[1], x.task[2], dkey())], habits: [mkHabit(pick(x.habit[0], lang), x.habit[1], x.habit[2])] };
}

export function buildSample(lang: string): Data {
  const r = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
  const now = new Date(), ago = (d: number, h = 10) => { const x = subDays(now, d); x.setHours(h, 0, 0, 0); return x.toISOString(); };
  const names: L[] = [['Finish project report', 'إنهاء تقرير المشروع'], ['Study chapter 4', 'مذاكرة الفصل الرابع'], ['Gym session', 'تمرين الجيم'], ['Pay electricity bill', 'دفع فاتورة الكهرباء'], ['Call the client', 'الاتصال بالعميل'], ['Clean the workspace', 'ترتيب مساحة العمل'], ['Read 30 pages', 'قراءة 30 صفحة'], ['Plan next week', 'تخطيط الأسبوع القادم'], ['Update CV', 'تحديث السيرة الذاتية'], ['Buy groceries', 'شراء احتياجات المنزل'], ['Prepare presentation', 'تجهيز العرض'], ['Reply to messages', 'الرد على الرسائل']];
  const pr: Priority[] = ['high', 'med', 'low', 'urgent'], cats = ['work', 'study', 'personal', 'health'];
  const tasks: Task[] = names.map((n, i) => {
    const done = i < 8, d = Math.floor(r(i) * 50) + 1;
    return { id: `demo_t${i}`, title: pick(n, lang), description: '', priority: pr[i % 4], category: cats[i % 4], completed: done, createdAt: ago(d + 2), completedAt: done ? ago(d) : undefined, dueDate: done ? undefined : dkey(subDays(now, i === 8 ? 1 : i === 9 ? 0 : -(i - 9))) };
  });
  const hs: [L, string, string, number][] = [[['Study 1 hour', 'مذاكرة ساعة'], '📚', '#7c3aed', 0.85], [['Workout', 'تمرين'], '💪', '#10b981', 0.65], [['Read', 'قراءة'], '📖', '#f59e0b', 0.45]];
  const habits: Habit[] = hs.map(([n, ic, c, p], h) => {
    const comp = Array.from({ length: 180 }, (_, d) => d).filter((d) => (h === 0 && d < 14) || r(h * 1000 + d) < p).map((d) => dkey(subDays(now, d)));
    return { id: `demo_h${h}`, name: pick(n, lang), icon: ic, color: c, completions: comp, streak: calcStreak(comp) };
  });
  const gs: [L, number, number, L[]][] = [[['Save 5000', 'ادخار 5000'], 5000, 3200, [['First 1000', 'أول 1000'], ['Half way', 'نصف المبلغ'], ['Goal reached', 'تحقيق الهدف']]], [['Read 12 books', 'قراءة 12 كتاب'], 12, 7, [['3 books', '3 كتب'], ['6 books', '6 كتب'], ['12 books', '12 كتاب']]], [['Learn React', 'تعلم React'], 100, 45, [['Basics', 'الأساسيات'], ['First app', 'أول تطبيق'], ['Deploy', 'النشر']]]];
  const goals = gs.map(([n, target, current, ms], i) => ({ id: `demo_g${i}`, title: pick(n, lang), target, current, milestones: ms.map((m, j) => ({ id: `demo_m${i}${j}`, title: pick(m, lang), done: (current / target) * 3 > j })) }));
  const notes = [{ id: 'demo_n0', title: pick(['Ideas', 'أفكار'], lang), content: '# Ideas\n- Weekly review\n- **Deep work** mornings', pinned: true, tags: ['ideas'], updatedAt: ago(1) }, { id: 'demo_n1', title: pick(['Meeting notes', 'ملاحظات اجتماع'], lang), content: '## Notes\n1. Follow up\n2. Send summary', pinned: false, tags: ['work'], updatedAt: ago(3) }];
  const sessions = Array.from({ length: 21 }, (_, d) => d).flatMap((d) => Array.from({ length: d === 0 ? 2 : Math.floor(r(d + 7) * 4) + 1 }, (_, k) => ({ id: `demo_s${d}_${k}`, duration: 25, completedAt: ago(d, 9 + k * 2) })));
  return { tasks, habits, goals, notes, sessions };
}

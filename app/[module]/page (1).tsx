import ModuleClient from './ModuleClient';

const SLUGS = ['tasks', 'habits', 'calendar', 'goals', 'notes', 'focus', 'stats', 'settings'];

// مطلوبة مع output: 'export' علشان Next يعرف يولّد كل صفحة مسبقاً
export const dynamicParams = false;
export function generateStaticParams() {
  return SLUGS.map((module) => ({ module }));
}

export default function Page({ params }: { params: { module: string } }) {
  return <ModuleClient slug={params.module} />;
}

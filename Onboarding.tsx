'use client';
import { useState } from 'react';
import { useStore, type Settings } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { buildExtra, buildTemplate, TPL } from '@/lib/templates';
import { cn } from '@/lib/utils';

export function TemplatePicker({ onDone }: { onDone?: () => void }) {
  const { addData, settings } = useStore(); const i = settings.lang === 'ar' ? 1 : 0;
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(TPL).map(([k, v]) => (
        <button key={k} onClick={() => { addData(buildTemplate(k, settings.lang)); onDone?.(); }} className="rounded-2xl bg-fg/10 px-4 py-3 text-sm transition hover:bg-primary hover:text-white"><span className="text-xl">{v.icon}</span> {v.label[i]}</button>
      ))}
    </div>
  );
}

export default function Onboarding() {
  const { addData, setSettings, settings } = useStore(); const t = useT(); const i = settings.lang === 'ar' ? 1 : 0;
  const [step, setStep] = useState(0); const [role, setRole] = useState('student'); const [ch, setCh] = useState('focus');
  const steps: { q: string; opts: [string, string][] }[] = [
    { q: 'onb1', opts: Object.entries(TPL).map(([k, v]) => [k, `${v.icon} ${v.label[i]}`] as [string, string]) },
    { q: 'onb2', opts: [['focus', t('chFocus')], ['consistency', t('chConsistency')], ['planning', t('chPlanning')]] },
    { q: 'onb3', opts: [['midnight', t('midnight')], ['dark', t('dark')], ['light', t('light')]] },
  ];
  const choose = (v: string) => {
    if (step === 0) { setRole(v); setStep(1); } else if (step === 1) { setCh(v); setStep(2); }
    else { addData(buildTemplate(role, settings.lang)); addData(buildExtra(ch, settings.lang)); setSettings({ theme: v as Settings['theme'], onboarded: true }); }
  };
  const s = steps[step];
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4">
      <div className="glass w-full max-w-md rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between"><div className="flex gap-1.5">{steps.map((_, n) => <span key={n} className={cn('h-1.5 w-8 rounded-full', n <= step ? 'bg-primary' : 'bg-fg/15')} />)}</div>
          <button onClick={() => setSettings({ onboarded: true })} className="text-sm text-fg/50 hover:text-fg">{t('skip')}</button></div>
        <h2 className="mb-4 text-xl font-bold">{t(s.q)}</h2>
        <div className="grid gap-2">{s.opts.map(([k, l]) => <button key={k} onClick={() => choose(k)} className="rounded-2xl bg-fg/10 px-4 py-3 text-start transition hover:bg-primary hover:text-white">{l}</button>)}</div>
      </div>
    </div>
  );
}

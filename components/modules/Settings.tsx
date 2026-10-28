'use client';
import { useRef, useState } from 'react';
import { Download, Upload, Trash2, Bell, Camera } from 'lucide-react';
import Avatar from '../Avatar';
import { resizeImage } from '@/lib/image';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Card, Button, PageTitle } from '../ui';
import ColorPicker from '../ColorPicker';
import { TemplatePicker } from '../Onboarding';

export default function Settings() {
  const s = useStore(); const t = useT(); const file = useRef<HTMLInputElement>(null); const [err, setErr] = useState(''); const hasSample = s.tasks.some((x) => x.id.startsWith('demo_'));
  const exportJson = () => {
    const { tasks, habits, goals, notes, sessions, events, settings } = s;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ tasks, habits, goals, notes, sessions, events, settings }, null, 2)], { type: 'application/json' }));
    a.download = `zenith-backup-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const importJson = async (f?: File) => {
    if (!f) return; setErr('');
    try { const d = JSON.parse(await f.text()); if (!d || typeof d !== 'object' || !['tasks', 'habits', 'goals', 'notes', 'sessions', 'events'].every((k) => d[k] === undefined || Array.isArray(d[k]))) throw 0; s.importData(d); } catch { setErr(t('importFail')); }
  };
  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <PageTitle>{t('settings')}</PageTitle>
      <Card className="flex items-center gap-4">
        <label className="relative cursor-pointer" aria-label={t('changePhoto')}>
          <Avatar size={80} />
          <span className="absolute -bottom-1 -end-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-white"><Camera size={14} /></span>
          <input type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) { try { s.setSettings({ avatar: await resizeImage(f) }); } catch { /* unsupported image */ } } }} />
        </label>
        <div className="flex-1 space-y-2">
          <input className="field" placeholder={t('yourName')} maxLength={40} value={s.settings.name ?? ''} onChange={(e) => s.setSettings({ name: e.target.value })} />
          <div className="flex items-center gap-3 text-xs text-fg/50">{s.settings.avatar && <button onClick={() => s.setSettings({ avatar: undefined })} className="text-red-500">{t('removePhoto')}</button>}<span>{t('saved')}</span></div>
        </div>
      </Card>
      <Card className="space-y-3">
        <div><p className="mb-1.5 text-sm text-fg/60">{t('theme')}</p><div className="flex gap-2">{(['light', 'dark', 'midnight'] as const).map((m) => <button key={m} onClick={() => s.setSettings({ theme: m })} className={cn('rounded-xl px-4 py-2 text-sm', s.settings.theme === m ? 'bg-primary text-white' : 'bg-fg/10')}>{t(m)}</button>)}</div></div>
        <div><p className="mb-1.5 text-sm text-fg/60">{t('accent')}</p><ColorPicker /></div>
        <div><p className="mb-1.5 text-sm text-fg/60">{t('language')}</p><div className="flex gap-2">{(['en', 'ar'] as const).map((l) => <button key={l} onClick={() => s.setSettings({ lang: l })} className={cn('rounded-xl px-4 py-2 text-sm', s.settings.lang === l ? 'bg-primary text-white' : 'bg-fg/10')}>{l === 'en' ? 'English (LTR)' : 'العربية (RTL)'}</button>)}</div></div>
        <Button variant="ghost" onClick={() => 'Notification' in window && Notification.requestPermission()}><Bell size={16} />{t('notifications')}</Button>
      </Card>
      <Card className="space-y-3">
        <p className="text-sm text-fg/60">{t('useTemplate')}</p><TemplatePicker />
        <label className="flex items-center justify-between gap-3 rounded-xl bg-fg/5 p-3 text-sm"><span>{t('sample')}</span>
          <input type="checkbox" className="h-5 w-5 accent-[rgb(var(--primary))]" checked={hasSample} onChange={(e) => (e.target.checked ? s.loadSample(s.settings.lang) : s.clearSample())} /></label>
        {hasSample && <p className="text-xs text-fg/50">{t('sampleOn')}</p>}
      </Card>
      <Card className="space-y-3">
        <p className="text-sm text-fg/60">{t('data')}</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportJson}><Download size={16} />{t('export')}</Button>
          <Button variant="ghost" onClick={() => file.current?.click()}><Upload size={16} />{t('import')}</Button>
          <Button variant="danger" onClick={() => confirm(t('confirm')) && s.clearAll()}><Trash2 size={16} />{t('clearAll')}</Button>
        </div>
        <input ref={file} type="file" accept="application/json" hidden onChange={(e) => { importJson(e.target.files?.[0]); e.target.value = ''; }} />
        {err && <p className="text-sm text-red-500">{err}</p>}
      </Card>
    </div>
  );
}

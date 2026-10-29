'use client';

import { useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export default function InstallButton({ lang }: { lang: string }) {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const ar = lang === 'ar';
  const ios = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone) {
      setInstalled(true);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (installed) return;
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') setInstallPrompt(null);
      return;
    }
    setHelpOpen((open) => !open);
  }

  if (installed) return null;

  return (
    <div className="relative shrink-0">
      <button onClick={handleInstall} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-90" aria-expanded={helpOpen} aria-label={ar ? 'تثبيت التطبيق' : 'Install app'}>
        {installPrompt ? <Download size={16} /> : <Smartphone size={16} />}
        <span className="hidden sm:inline">{ar ? 'تثبيت' : 'Install'}</span>
      </button>
      {helpOpen && !installPrompt && (
        <div className="glass absolute end-0 top-12 z-50 w-64 rounded-2xl border p-3 text-sm shadow-2xl">
          <p className="mb-2 font-semibold">{ar ? 'إضافة Zenith للشاشة الرئيسية' : 'Add Zenith to Home Screen'}</p>
          <p className="text-fg/70">{ios ? (ar ? 'اضغط زر المشاركة في Safari ثم «إضافة إلى الشاشة الرئيسية».' : 'Tap the Share button in Safari, then “Add to Home Screen”.') : (ar ? 'من قائمة المتصفح ⋮ اختار «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».' : 'Open the browser menu ⋮ and choose “Install app” or “Add to Home screen”.')}</p>
          <button onClick={() => setHelpOpen(false)} className="mt-3 rounded-lg bg-fg/10 px-3 py-1.5">{ar ? 'تمام' : 'Got it'}</button>
        </div>
      )}
    </div>
  );
}

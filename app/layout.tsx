import type { Metadata, Viewport } from 'next';
import './globals.css';
import Shell from '@/components/Shell';

export const metadata: Metadata = {
  title: 'Zenith — Productivity Workspace', manifest: '/manifest.json', icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/icon-192.png', type: 'image/png' }], apple: '/icon-192.png' },
  appleWebApp: { capable: true, title: 'Zenith', statusBarStyle: 'black-translucent' },
};
export const viewport: Viewport = { themeColor: '#7c3aed', width: 'device-width', initialScale: 1 };
const boot = `try{var s=JSON.parse(localStorage.getItem('zenith-settings')||'{}');var r=document.documentElement;r.dataset.theme=s.theme||'midnight';r.lang=s.lang||'en';r.dir=s.lang==='ar'?'rtl':'ltr'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="midnight" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: boot }} /></head>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}

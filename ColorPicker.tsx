'use client';
import { COLORS } from '@/lib/colors';
import { useStore } from '@/lib/store';

export default function ColorPicker() {
  const { settings, setSettings } = useStore(); const custom = settings.color.startsWith('#');
  return (
    <div className="flex flex-wrap gap-1.5 rounded-2xl bg-fg/5 p-1.5">
      {Object.entries(COLORS).map(([n, c]) => (
        <button key={n} aria-label={n} onClick={() => setSettings({ color: n })} className="grid h-8 w-8 place-items-center rounded-lg border-2 border-transparent" style={{ background: `rgb(${c})`, borderColor: settings.color === n ? 'rgb(var(--fg))' : undefined }}>
          {settings.color === n && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
        </button>
      ))}
      <label aria-label="custom color" className="relative grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-lg font-bold text-white" style={{ background: 'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)', outline: custom ? '2px solid rgb(var(--fg))' : undefined }}>
        +<input type="color" className="absolute inset-0 cursor-pointer opacity-0" value={custom ? settings.color : '#7c3aed'} onChange={(e) => setSettings({ color: e.target.value })} />
      </label>
    </div>
  );
}

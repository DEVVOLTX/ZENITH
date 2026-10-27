'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Pin, Plus, Trash2, LayoutGrid, List, Eye, Pencil } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Card, Button, PageTitle, Empty } from '../ui';

export default function Notes() {
  const { notes, addNote, updateNote, delNote, query, setQuery } = useStore(); const t = useT();
  const [sel, setSel] = useState(''), [grid, setGrid] = useState(true), [prev, setPrev] = useState(false), [tag, setTag] = useState('');
  const all = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const list = notes.filter((n) => (!tag || n.tags.includes(tag)) && (!query || (n.title + n.content + n.tags.join(' ')).toLowerCase().includes(query.toLowerCase())))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt));
  const cur = notes.find((n) => n.id === sel);
  return (
    <div>
      <div className="flex items-center justify-between"><PageTitle>{t('notes')}</PageTitle><Button onClick={() => { setSel(addNote()); setPrev(false); }}><Plus size={16} />{t('newNote')}</Button></div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input className="field max-w-xs" placeholder={t('search')} value={query} onChange={(e) => setQuery(e.target.value)} />
        {all.map((x) => <button key={x} onClick={() => setTag(tag === x ? '' : x)} className={cn('rounded-full px-3 py-1 text-xs', tag === x ? 'bg-primary text-white' : 'bg-fg/10')}>#{x}</button>)}
        <button onClick={() => setGrid(!grid)} className="ms-auto rounded-xl bg-fg/10 p-2" aria-label={grid ? t('list') : t('grid')}>{grid ? <List size={16} /> : <LayoutGrid size={16} />}</button>
      </div>
      {cur && (
        <Card className="mb-3 space-y-2">
          <div className="flex gap-2">
            <input className="field text-base font-semibold" placeholder={t('untitled')} value={cur.title} onChange={(e) => updateNote(cur.id, { title: e.target.value })} />
            <button onClick={() => updateNote(cur.id, { pinned: !cur.pinned })} className={cn('rounded-xl p-2', cur.pinned ? 'bg-primary text-white' : 'bg-fg/10')} aria-label={t('pin')}><Pin size={16} /></button>
            <button onClick={() => setPrev(!prev)} className="rounded-xl bg-fg/10 p-2" aria-label={t('preview')}>{prev ? <Pencil size={16} /> : <Eye size={16} />}</button>
            <button onClick={() => { delNote(cur.id); setSel(''); }} className="rounded-xl bg-red-500/15 p-2 text-red-500" aria-label={t('delete')}><Trash2 size={16} /></button>
          </div>
          <input className="field" placeholder={t('tags')} defaultValue={cur.tags.join(', ')} key={cur.id} onBlur={(e) => updateNote(cur.id, { tags: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
          {prev ? <div className="md min-h-48 rounded-xl bg-fg/5 p-3 text-sm"><ReactMarkdown>{cur.content}</ReactMarkdown></div>
            : <textarea className="field min-h-48 font-mono" placeholder="# Markdown" value={cur.content} onChange={(e) => updateNote(cur.id, { content: e.target.value })} />}
        </Card>
      )}
      {list.length === 0 && <Empty>{t('noNotes')}</Empty>}
      <div className={cn('gap-3', grid ? 'grid sm:grid-cols-2 lg:grid-cols-3' : 'space-y-2')}>
        {list.map((n) => (
          <button key={n.id} onClick={() => { setSel(n.id); setPrev(false); }} className="text-start">
            <Card className={cn('h-full p-3 transition hover:brightness-110', sel === n.id && 'ring-1 ring-primary')}>
              <p className="flex items-center gap-1 font-semibold">{n.pinned && <Pin size={13} className="text-primary" />}{n.title || t('untitled')}</p>
              <p className="mt-1 line-clamp-3 text-xs text-fg/60">{n.content.replace(/[#*`>_-]/g, '')}</p>
              <p className="mt-2 flex flex-wrap gap-1">{n.tags.map((x) => <span key={x} className="rounded-full bg-primary/20 px-2 text-[10px] text-primary">#{x}</span>)}</p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

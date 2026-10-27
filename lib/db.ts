import { openDB } from 'idb';
const p = () => openDB('zenith', 1, { upgrade(d) { d.createObjectStore('kv'); } });
export async function dbGet(k: string) { try { return await (await p()).get('kv', k); } catch { return undefined; } }
export async function dbSet(k: string, v: unknown) { try { await (await p()).put('kv', v, k); } catch { /* ignore */ } }

export const COLORS: Record<string, string> = { violet: '124 58 237', blue: '59 130 246', emerald: '16 185 129', rose: '244 63 94', amber: '245 158 11', cyan: '6 182 212' };
export const hexRgb = (h: string) => (/^#[0-9a-f]{6}$/i.test(h) ? [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(' ') : '');
export const primaryRgb = (c: string) => COLORS[c] || hexRgb(c) || COLORS.violet;

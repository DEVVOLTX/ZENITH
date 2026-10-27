import type { Config } from 'tailwindcss';
const v = (n: string) => `rgb(var(--${n}) / <alpha-value>)`;
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { bg: v('bg'), card: v('card'), primary: v('primary'), fg: v('fg') } } },
  plugins: [],
};
export default config;

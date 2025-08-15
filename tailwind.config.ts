import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './App.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config

import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#F8F2F4', rose: '#E8D7DC', mauve: '#CBA8B4', wine: '#5C3D46', plum: '#2F1E24'
      },
      borderRadius: { luxury: '24px' }
    }
  },
  plugins: []
} satisfies Config;

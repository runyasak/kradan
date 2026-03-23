import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.1,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],

  theme: {
    colors: {
      bg: '#0d1117',
      surface: '#161b22',
      panel: '#1c2128',
      border: '#30363d',
      accent: '#58c6fc',
      'accent-dim': '#1f4f6e',
      text: '#cdd9e5',
      muted: '#768390',
      unseen: '#e3b341',
      green: '#3fb950',
      red: '#f85149',
    },
    fontFamily: {
      mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },

  shortcuts: {
    'btn': 'px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer border border-border',
    'btn-primary': 'btn bg-accent text-bg hover:bg-accent/90 border-accent',
    'btn-ghost': 'btn bg-transparent text-muted hover:text-text hover:bg-panel',
    'tag': 'px-2 py-0.5 rounded text-xs font-mono',
    'divider': 'border-border',
  },

  safelist: [
    'text-accent',
    'text-unseen',
    'text-green',
    'text-red',
    'text-muted',
    'bg-panel',
    'bg-surface',
  ],
})

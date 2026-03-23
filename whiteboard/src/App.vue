<script setup>
import AppNav from '@/components/AppNav.vue'
</script>

<template>
  <div class="app">
    <AppNav />
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  color-scheme: dark;
}

html, body, #app {
  height: 100%;
  overflow: hidden;
}

body {
  background: #0d1117;
  color: #cdd9e5;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #484f58; }

.app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Shiki output */
.shiki {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.7;
  tab-size: 2;
  padding: 1.25rem 1.5rem;
  overflow: auto;
  background: transparent !important;
  height: 100%;
}

.shiki code {
  display: block;
  counter-reset: line;
}

.shiki .line {
  display: block;
  min-height: 1.7em;
  padding-left: 2.5em;
  position: relative;
}

.shiki .line::before {
  content: counter(line);
  counter-increment: line;
  position: absolute;
  left: 0;
  width: 2em;
  text-align: right;
  color: #3d444d;
  user-select: none;
  font-size: 0.9em;
}

.shiki .line.highlighted {
  background: rgba(227, 179, 65, 0.1);
  border-left: 2px solid #e3b341;
  margin-left: -2px;
}
</style>

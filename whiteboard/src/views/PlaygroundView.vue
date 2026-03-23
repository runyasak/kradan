<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { createHighlighter } from 'shiki'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'vue', label: 'Vue' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'yaml', label: 'YAML' },
  { value: 'toml', label: 'TOML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'text', label: 'Plain text' },
]

const THEMES = [
  { value: 'tokyo-night', label: 'Tokyo Night' },
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'one-dark-pro', label: 'One Dark Pro' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'night-owl', label: 'Night Owl' },
  { value: 'catppuccin-mocha', label: 'Catppuccin Mocha' },
  { value: 'vitesse-dark', label: 'Vitesse Dark' },
]

const code = ref(`// Welcome to Whiteboard Playground
// Paste or type your code here

function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet('world'))
`)
const lang = ref('javascript')
const theme = ref('tokyo-night')
const html = ref('')
const copied = ref(false)
const loading = ref(false)
const wordWrap = ref(false)

let highlighter = null

async function getHighlighter() {
  if (highlighter) return highlighter
  highlighter = await createHighlighter({
    themes: THEMES.map((t) => t.value),
    langs: LANGUAGES.map((l) => l.value),
  })
  return highlighter
}

async function highlight() {
  if (!code.value.trim()) {
    html.value = ''
    return
  }
  loading.value = true
  try {
    const h = await getHighlighter()
    html.value = h.codeToHtml(code.value, {
      lang: lang.value,
      theme: theme.value,
    })
  } finally {
    loading.value = false
  }
}

async function copyCode() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

async function copyHtml() {
  await navigator.clipboard.writeText(html.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function clearCode() {
  code.value = ''
}

const lineCount = computed(() => code.value.split('\n').length)
const charCount = computed(() => code.value.length)

onMounted(highlight)
watch([code, lang, theme], highlight)
</script>

<template>
  <div class="playground">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <select v-model="lang" class="select">
          <option v-for="l in LANGUAGES" :key="l.value" :value="l.value">{{ l.label }}</option>
        </select>
        <select v-model="theme" class="select">
          <option v-for="t in THEMES" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
        <button class="btn-toolbar" :class="{ active: wordWrap }" @click="wordWrap = !wordWrap" title="Toggle word wrap">
          <span class="i-lucide-wrap-text" />
        </button>
      </div>

      <div class="toolbar-right">
        <span class="meta">{{ lineCount }} lines · {{ charCount }} chars</span>
        <button class="btn-toolbar" @click="clearCode" title="Clear">
          <span class="i-lucide-trash-2" />
        </button>
        <button class="btn-toolbar" @click="copyCode" title="Copy source">
          <span :class="copied ? 'i-lucide-check' : 'i-lucide-copy'" />
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
        <button class="btn-toolbar accent" @click="copyHtml" title="Copy rendered HTML">
          <span class="i-lucide-code-2" />
          Copy HTML
        </button>
      </div>
    </div>

    <!-- Split panes -->
    <div class="panes">
      <!-- Input -->
      <div class="pane input-pane">
        <div class="pane-header">
          <span class="i-lucide-pencil mr-1.5 text-muted" />
          Input
        </div>
        <textarea
          v-model="code"
          class="editor"
          :class="{ wrap: wordWrap }"
          placeholder="Paste or type your code here..."
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
        />
      </div>

      <!-- Divider -->
      <div class="pane-divider" />

      <!-- Preview -->
      <div class="pane preview-pane">
        <div class="pane-header">
          <span class="i-lucide-sparkles mr-1.5 text-muted" />
          Preview
          <span v-if="loading" class="i-lucide-loader-2 animate-spin ml-2 text-muted" />
        </div>
        <div class="preview" :class="{ 'wrap': wordWrap }">
          <div v-if="!html" class="preview-empty">
            <span class="i-lucide-code text-3xl text-muted" />
            <p class="text-muted text-sm mt-2">Start typing to see highlighted code</p>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-else v-html="html" class="preview-html" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 8px 12px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
  flex-shrink: 0;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.select {
  appearance: none;
  background: #1c2128;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #cdd9e5;
  padding: 4px 28px 4px 10px;
  font-size: 0.82rem;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23768390' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  transition: border-color 0.15s;
}

.select:hover { border-color: #484f58; }
.select:focus { outline: none; border-color: #58c6fc; }

.btn-toolbar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #30363d;
  background: #1c2128;
  color: #768390;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-toolbar:hover { color: #cdd9e5; border-color: #484f58; }
.btn-toolbar.active { color: #58c6fc; border-color: #58c6fc; background: #1f4f6e33; }
.btn-toolbar.accent { color: #58c6fc; border-color: #58c6fc; }
.btn-toolbar.accent:hover { background: #1f4f6e55; }

.meta {
  font-size: 0.75rem;
  color: #484f58;
  font-family: 'JetBrains Mono', monospace;
}

/* Panes */
.panes {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.pane {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.pane-header {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #768390;
  background: #161b22;
  border-bottom: 1px solid #30363d;
  flex-shrink: 0;
}

.pane-divider {
  width: 3px;
  background: #30363d;
  flex-shrink: 0;
}

/* Input */
.editor {
  flex: 1;
  background: #0d1117;
  color: #cdd9e5;
  border: none;
  outline: none;
  resize: none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.7;
  padding: 1.25rem 1.5rem;
  tab-size: 2;
}

.editor::placeholder { color: #484f58; }
.editor.wrap { white-space: pre-wrap; }

/* Preview */
.preview {
  flex: 1;
  overflow: auto;
  background: #0d1117;
}

.preview.wrap :deep(.shiki code) {
  white-space: pre-wrap;
  word-break: break-all;
}

.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #484f58;
}

.preview-html {
  height: 100%;
}

.preview-html :deep(.shiki) {
  height: 100%;
  min-height: 100%;
}
</style>

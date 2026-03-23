<script setup>
import { ref, watch, onMounted } from 'vue'
import { createHighlighter } from 'shiki'

const props = defineProps({
  content: { type: String, default: '' },
  ext: { type: String, default: 'txt' },
  highlightedLines: { type: Array, default: () => [] },
})

const html = ref('')
let highlighter = null

const EXT_LANG_MAP = {
  js: 'javascript', mjs: 'javascript', cjs: 'javascript',
  ts: 'typescript', tsx: 'tsx', jsx: 'jsx',
  vue: 'vue', html: 'html', css: 'css', scss: 'scss',
  json: 'json', jsonc: 'jsonc', json5: 'json5',
  md: 'markdown', mdx: 'mdx',
  py: 'python', go: 'go', rs: 'rust', php: 'php',
  sh: 'bash', bash: 'bash', zsh: 'bash',
  yaml: 'yaml', yml: 'yaml', toml: 'toml',
  sql: 'sql', graphql: 'graphql',
  dockerfile: 'dockerfile',
  txt: 'text',
}

async function getHighlighter() {
  if (highlighter) return highlighter
  highlighter = await createHighlighter({
    themes: ['tokyo-night'],
    langs: Object.values(new Set(Object.values(EXT_LANG_MAP))),
  })
  return highlighter
}

async function highlight() {
  if (!props.content) {
    html.value = ''
    return
  }
  const h = await getHighlighter()
  const lang = EXT_LANG_MAP[props.ext.toLowerCase()] ?? 'text'
  html.value = h.codeToHtml(props.content, {
    lang,
    theme: 'tokyo-night',
    transformers: [
      {
        line(node, line) {
          if (props.highlightedLines.includes(line)) {
            node.properties.class = (node.properties.class ?? '') + ' highlighted'
          }
        },
      },
    ],
  })
}

onMounted(highlight)
watch(() => [props.content, props.ext, props.highlightedLines], highlight)
</script>

<template>
  <div class="code-viewer">
    <div v-if="!content" class="empty">
      <span class="i-lucide-file-code text-3xl text-muted mb-2" />
      <p>Select a file to view</p>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-else class="shiki-wrap" v-html="html" />
  </div>
</template>

<style scoped>
.code-viewer {
  height: 100%;
  overflow: auto;
  background: #0d1117;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #484f58;
  font-size: 0.85rem;
  gap: 0.5rem;
}

.shiki-wrap {
  height: 100%;
  overflow: auto;
}

.shiki-wrap :deep(.shiki) {
  height: 100%;
}
</style>

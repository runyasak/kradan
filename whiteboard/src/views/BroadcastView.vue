<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useBroadcastStore } from '@/stores/broadcast.js'
import FileTree from '@/components/FileTree.vue'
import CodeViewer from '@/components/CodeViewer.vue'

const store = useBroadcastStore()

// ── Resizable split ───────────────────────────────────────────────────────────
const sidebarWidth = ref(220)
const dragging = ref(false)

function onMouseDown() { dragging.value = true }
function onMouseMove(e) {
  if (!dragging.value) return
  sidebarWidth.value = Math.max(150, Math.min(400, e.clientX))
}
function onMouseUp() { dragging.value = false }

// ── WebSocket ─────────────────────────────────────────────────────────────────
let ws = null

function connect() {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
  ws = new WebSocket(`${protocol}://${location.host}/ws`)

  ws.onopen = () => store.setConnected(true)
  ws.onclose = () => {
    store.setConnected(false)
    setTimeout(connect, 3000) // auto-reconnect
  }
  ws.onerror = () => ws.close()

  ws.onmessage = async ({ data }) => {
    const msg = JSON.parse(data)
    if (msg.type === 'tree') {
      store.setTree(msg.data)
    } else if (msg.type === 'change') {
      store.markUnseen(msg.path)
      // Refresh file content if it's open
      const open = store.openFiles.find((f) => f.path === msg.path)
      if (open) await loadFile(msg.path, true)
    }
  }
}

// ── File loading ──────────────────────────────────────────────────────────────
async function loadFile(path, isUpdate = false) {
  const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`)
  if (!res.ok) return
  const { content, ext } = await res.json()

  if (isUpdate) {
    store.updateFileContent(path, content)
  } else {
    const name = path.split('/').pop()
    store.openFile({ path, name, content, ext: ext || 'txt' })
  }
}

async function selectFile(path) {
  store.markSeen(path)
  const already = store.openFiles.find((f) => f.path === path)
  if (already) {
    store.setActive(path)
  } else {
    await loadFile(path)
  }
}

onMounted(connect)
onUnmounted(() => ws?.close())
</script>

<template>
  <div
    class="broadcast"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  >
    <!-- Sidebar -->
    <aside class="sidebar" :style="{ width: sidebarWidth + 'px' }">
      <div class="sidebar-header">
        <span class="i-lucide-folder-tree mr-1.5 text-muted" />
        <span class="sidebar-title">Files</span>
      </div>
      <div class="sidebar-tree">
        <FileTree
          v-if="store.tree"
          :node="store.tree"
          @select="selectFile"
        />
        <div v-else class="sidebar-empty">
          <span class="i-lucide-loader-2 animate-spin text-muted" />
        </div>
      </div>
    </aside>

    <!-- Drag handle -->
    <div class="drag-handle" @mousedown.prevent="onMouseDown" />

    <!-- Main -->
    <div class="content" :style="{ width: `calc(100% - ${sidebarWidth + 3}px)` }">
      <!-- Tab bar -->
      <div class="tabs" v-if="store.openFiles.length">
        <div
          v-for="file in store.openFiles"
          :key="file.path"
          class="tab"
          :class="{
            active: store.activeFilePath === file.path,
            unseen: store.isUnseen(file.path),
          }"
          @click="store.setActive(file.path)"
        >
          <span class="tab-name">{{ file.name }}</span>
          <button class="tab-close" @click.stop="store.closeFile(file.path)">
            <span :class="store.isUnseen(file.path) ? 'i-lucide-circle-dot' : 'i-lucide-x'" />
          </button>
        </div>
      </div>

      <!-- Code view -->
      <div class="viewer">
        <CodeViewer
          v-if="store.activeFile"
          :content="store.activeFile.content"
          :ext="store.activeFile.ext"
        />
        <div v-else-if="!store.openFiles.length" class="viewer-empty">
          <span class="i-lucide-mouse-pointer-click text-4xl text-muted" />
          <p class="text-muted mt-3">Select a file from the tree</p>
          <p class="text-muted/50 text-xs mt-1">File changes will be highlighted automatically</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.broadcast {
  display: flex;
  height: 100%;
  overflow: hidden;
  cursor: default;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  background: #161b22;
  border-right: 1px solid #30363d;
  flex-shrink: 0;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 8px 12px 6px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #768390;
  border-bottom: 1px solid #30363d;
  flex-shrink: 0;
}

.sidebar-title {
  line-height: 1;
}

.sidebar-tree {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 0;
}

.sidebar-empty {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

/* Drag handle */
.drag-handle {
  width: 3px;
  background: #30363d;
  cursor: col-resize;
  flex-shrink: 0;
  transition: background 0.15s;
}

.drag-handle:hover {
  background: #58c6fc;
}

/* Content */
.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* Tabs */
.tabs {
  display: flex;
  overflow-x: auto;
  background: #161b22;
  border-bottom: 1px solid #30363d;
  flex-shrink: 0;
  height: 36px;
}

.tabs::-webkit-scrollbar { height: 0; }

.tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 12px;
  height: 36px;
  cursor: pointer;
  color: #768390;
  font-size: 0.82rem;
  white-space: nowrap;
  border-right: 1px solid #30363d;
  transition: color 0.1s, background 0.1s;
  user-select: none;
  min-width: 120px;
  max-width: 180px;
}

.tab:hover { color: #cdd9e5; background: #1c2128; }

.tab.active {
  color: #cdd9e5;
  background: #0d1117;
  border-top: 2px solid #58c6fc;
}

.tab.unseen { color: #e3b341; }

.tab-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-close {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: inherit;
  opacity: 0.5;
  border-radius: 3px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.tab-close:hover { opacity: 1; background: #30363d; }

/* Viewer */
.viewer {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.viewer-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #484f58;
}
</style>

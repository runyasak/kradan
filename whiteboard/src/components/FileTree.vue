<script setup>
import { ref, computed } from 'vue'
import { useBroadcastStore } from '@/stores/broadcast.js'

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
})

const emit = defineEmits(['select'])
const store = useBroadcastStore()
const isOpen = ref(props.depth === 0)

const isDir = computed(() => props.node.type === 'directory')
const isActive = computed(() => store.activeFilePath === props.node.path)
const isUnseen = computed(() => store.isUnseen(props.node.path))

const icon = computed(() => {
  if (isDir.value) return isOpen.value ? 'i-lucide-folder-open' : 'i-lucide-folder'
  const ext = props.node.name.split('.').pop().toLowerCase()
  const map = {
    vue: 'i-lucide-component',
    js: 'i-lucide-file-code',
    ts: 'i-lucide-file-code',
    jsx: 'i-lucide-file-code',
    tsx: 'i-lucide-file-code',
    json: 'i-lucide-braces',
    md: 'i-lucide-file-text',
    css: 'i-lucide-paintbrush',
    scss: 'i-lucide-paintbrush',
    html: 'i-lucide-code',
    py: 'i-lucide-file-code',
    go: 'i-lucide-file-code',
    rs: 'i-lucide-file-code',
    sh: 'i-lucide-terminal',
    png: 'i-lucide-image',
    jpg: 'i-lucide-image',
    svg: 'i-lucide-image',
    gif: 'i-lucide-image',
  }
  return map[ext] ?? 'i-lucide-file'
})

function handleClick() {
  if (isDir.value) {
    isOpen.value = !isOpen.value
  } else {
    emit('select', props.node.path)
  }
}
</script>

<template>
  <div class="tree-node">
    <div
      class="tree-item"
      :class="{
        active: isActive,
        unseen: isUnseen,
        dir: isDir,
      }"
      :style="{ paddingLeft: `${depth * 12 + 10}px` }"
      @click="handleClick"
    >
      <span class="tree-icon" :class="icon" />
      <span class="tree-name">{{ node.name }}</span>
      <span v-if="isUnseen && !isDir" class="unseen-dot" title="Changed" />
    </div>

    <template v-if="isDir && isOpen && node.children">
      <FileTree
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :depth="depth + 1"
        @select="$emit('select', $event)"
      />
    </template>
  </div>
</template>

<style scoped>
.tree-item {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding-right: 10px;
  cursor: pointer;
  border-radius: 4px;
  color: #768390;
  user-select: none;
  transition: color 0.1s, background 0.1s;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.82rem;
}

.tree-item:hover {
  background: #1c2128;
  color: #cdd9e5;
}

.tree-item.active {
  background: #1c2128;
  color: #58c6fc;
}

.tree-item.unseen {
  color: #e3b341;
}

.tree-item.dir {
  font-weight: 500;
}

.tree-icon {
  flex-shrink: 0;
  color: inherit;
}

.tree-name {
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.unseen-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e3b341;
  flex-shrink: 0;
}
</style>

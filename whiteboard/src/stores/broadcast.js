import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBroadcastStore = defineStore('broadcast', () => {
  const tree = ref(null)
  const openFiles = ref([])   // [{ path, name, content, ext, unseenLines }]
  const activeFilePath = ref('')
  const unseenPaths = ref(new Set())
  const connected = ref(false)

  const activeFile = computed(() =>
    openFiles.value.find((f) => f.path === activeFilePath.value) ?? null
  )

  function setTree(newTree) {
    tree.value = newTree
  }

  function setConnected(val) {
    connected.value = val
  }

  function markUnseen(path) {
    unseenPaths.value.add(path)
  }

  function markSeen(path) {
    unseenPaths.value.delete(path)
  }

  function isUnseen(path) {
    return unseenPaths.value.has(path)
  }

  function openFile(file) {
    const existing = openFiles.value.find((f) => f.path === file.path)
    if (!existing) {
      openFiles.value.push(file)
    } else {
      Object.assign(existing, file)
    }
    activeFilePath.value = file.path
    markSeen(file.path)
  }

  function closeFile(path) {
    const idx = openFiles.value.findIndex((f) => f.path === path)
    if (idx === -1) return
    openFiles.value.splice(idx, 1)
    if (activeFilePath.value === path) {
      const next = openFiles.value[Math.max(0, idx - 1)]
      activeFilePath.value = next?.path ?? ''
    }
  }

  function setActive(path) {
    activeFilePath.value = path
    markSeen(path)
  }

  function updateFileContent(path, content) {
    const file = openFiles.value.find((f) => f.path === path)
    if (file) {
      file.content = content
    }
  }

  return {
    tree,
    openFiles,
    activeFilePath,
    activeFile,
    unseenPaths,
    connected,
    setTree,
    setConnected,
    markUnseen,
    markSeen,
    isUnseen,
    openFile,
    closeFile,
    setActive,
    updateFileContent,
  }
})

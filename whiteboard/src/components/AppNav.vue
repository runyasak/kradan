<script setup>
import { useRoute } from 'vue-router'
import { useBroadcastStore } from '@/stores/broadcast.js'

const route = useRoute()
const store = useBroadcastStore()
</script>

<template>
  <nav class="nav">
    <div class="nav-brand">
      <span class="nav-logo">▣</span>
      <span class="nav-name">whiteboard</span>
    </div>

    <div class="nav-links">
      <RouterLink to="/" class="nav-link" :class="{ active: route.path === '/' }">
        <span class="i-lucide-radio mr-1" />
        Broadcast
      </RouterLink>
      <RouterLink to="/playground" class="nav-link" :class="{ active: route.path === '/playground' }">
        <span class="i-lucide-flask-conical mr-1" />
        Playground
      </RouterLink>
    </div>

    <div class="nav-status">
      <span
        class="status-dot"
        :class="store.connected ? 'connected' : 'disconnected'"
        :title="store.connected ? 'Connected' : 'Disconnected'"
      />
      <span class="status-text">{{ store.connected ? 'live' : 'offline' }}</span>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 44px;
  padding: 0 1rem;
  background: #161b22;
  border-bottom: 1px solid #30363d;
  flex-shrink: 0;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #cdd9e5;
  margin-right: 0.5rem;
}

.nav-logo {
  color: #58c6fc;
  font-size: 1.1rem;
}

.nav-name {
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  color: #768390;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.15s, background 0.15s;
}

.nav-link:hover {
  color: #cdd9e5;
  background: #1c2128;
}

.nav-link.active {
  color: #58c6fc;
  background: #1f4f6e33;
}

.nav-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-dot.connected {
  background: #3fb950;
  box-shadow: 0 0 6px #3fb950;
}

.status-dot.disconnected {
  background: #484f58;
}

.status-text {
  font-size: 0.75rem;
  color: #768390;
  font-family: 'JetBrains Mono', monospace;
}
</style>

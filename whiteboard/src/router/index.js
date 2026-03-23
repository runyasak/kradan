import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'broadcast',
    component: () => import('@/views/BroadcastView.vue'),
  },
  {
    path: '/playground',
    name: 'playground',
    component: () => import('@/views/PlaygroundView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

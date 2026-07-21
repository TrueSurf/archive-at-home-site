<script setup lang="ts">
import { onMounted, ref } from 'vue'

const THEME_KEY = 'aah-theme'
const isDark = ref(false)

function readTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function apply(mode: 'dark' | 'light') {
  isDark.value = mode === 'dark'
  const root = document.documentElement
  if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark')
    root.classList.add('dark')
  } else {
    root.removeAttribute('data-theme')
    root.classList.remove('dark')
  }
}

function toggle() {
  const next = isDark.value ? 'light' : 'dark'
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    /* ignore */
  }
  apply(next)
}

onMounted(() => apply(readTheme()))
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? '切换浅色模式' : '切换深色模式'"
    :title="isDark ? '切换浅色模式' : '切换深色模式'"
    @click="toggle"
  >
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z"/></svg>
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
  </button>
</template>

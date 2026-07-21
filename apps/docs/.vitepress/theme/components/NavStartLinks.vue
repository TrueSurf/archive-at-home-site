<script setup lang="ts">
/**
 * 文档顶栏「首页」：指向文档站首页，并在文档首页高亮。
 */
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'

const route = useRoute()
const { frontmatter } = useData()

const isDocsHome = computed(() => {
  if (frontmatter.value.layout === 'home') return true
  const p = route.path.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/'
  return p === '/'
})
</script>

<template>
  <a
    class="nav-text-link"
    :class="{ active: isDocsHome }"
    :href="withBase('/')"
  >首页</a>
</template>

<style scoped>
.nav-text-link {
  display: inline-flex;
  align-items: center;
  align-self: center;
  height: auto;
  min-height: 0;
  padding: 7px 14px;
  border-radius: var(--radius-m);
  color: var(--on-surface-variant);
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.15s ease, background 0.15s ease;
}

.nav-text-link:hover {
  color: var(--on-surface);
  background: var(--surface-container);
  text-decoration: none;
}

.nav-text-link.active {
  color: var(--on-brand-container);
  background: var(--brand-container);
  font-weight: 600;
}

.nav-text-link.active:hover {
  color: var(--on-brand-container);
  background: var(--brand-container);
}

@media (max-width: 767px) {
  .nav-text-link {
    display: block;
    border-radius: 0;
    border-bottom: 1px solid var(--outline-variant);
    padding: 12px 0 11px;
    line-height: 24px;
    background: transparent;
  }

  .nav-text-link:hover {
    background: transparent;
    color: var(--brand-strong);
  }

  .nav-text-link.active {
    color: var(--on-brand-container);
    background: transparent;
  }
}
</style>

<script setup lang="ts">
/**
 * 返回主站：主站根路径。
 * 必须带 target，否则 VitePress 会拦截同域 / 并当文档路由处理。
 */
</script>

<template>
  <a class="nav-text-link nav-text-link--brand" href="/" target="_self">返回主站</a>
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
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.15s ease, background 0.15s ease;
}

.nav-text-link--brand {
  color: #ffffff;
  background: var(--brand);
}

.nav-text-link--brand:hover {
  color: #ffffff;
  background: var(--brand-strong);
  text-decoration: none;
}

html[data-theme='dark'] .nav-text-link--brand {
  color: #06221f;
}

html[data-theme='dark'] .nav-text-link--brand:hover {
  color: #06221f;
  background: var(--brand-strong);
}

@media (max-width: 767px) {
  .nav-text-link--brand {
    display: block;
    margin: 8px 0;
    border-radius: var(--radius-m);
    padding: 10px 14px;
    text-align: center;
  }
}
</style>

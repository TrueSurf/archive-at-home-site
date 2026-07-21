<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page, theme } = useData()
const isHome = computed(() => frontmatter.value.layout === 'home')
</script>

<template>
  <site-footer
    v-if="!page.isNotFound"
    docs-mode
    :class="{ 'docs-page-footer': !isHome }"
    :site-base="theme.siteBase || '/'"
    :docs-base="theme.docsBase"
  />
</template>

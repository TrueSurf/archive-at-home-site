<script setup lang="ts">
import { useData } from 'vitepress'

const { page, theme } = useData()
</script>

<template>
  <site-navbar v-if="!page.isNotFound" docs-mode :site-base="theme.siteBase || '/'" :docs-base="theme.docsBase" />
</template>

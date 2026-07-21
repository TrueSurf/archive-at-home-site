<script setup lang="ts">
const href = 'mailto:mail@example.com'
const label = 'mail@example.com'
</script>

<template>
  <a class="nav-icon-link MailLink" :href="href" :title="label" :aria-label="`发送邮件至 ${label}`">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  </a>
</template>

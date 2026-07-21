<script setup lang="ts">
import { withBase } from 'vitepress'

const mainHome = (import.meta.env.BASE_URL || '/docs/').replace(/docs\/?$/, '') || '/'
</script>

<template>
  <footer class="site-footer docs-footer">
    <div class="container">
      <div class="footer-note">
        <p><strong>Archive at Home</strong> · 由志愿者维护的公益项目，与 E-Hentai 官方无关。</p>
        <p>
          解析能力来自志愿者节点共享的账号配额。有富余配额可<a :href="withBase('/node')">部署节点</a>。
        </p>
        <p>
          © 2026 Archive at Home · 源代码以开源协议发布于
          <a href="https://github.com/Archive-At-Home" target="_blank" rel="noopener">GitHub</a>
        </p>
      </div>
      <nav class="footer-links" aria-label="页脚导航">
        <a href="https://t.me/ArchiveAtHome" target="_blank" rel="noopener">Telegram 频道</a>
        <a href="https://t.me/ArchiveAtHome_bot" target="_blank" rel="noopener">Telegram Bot</a>
        <a href="mailto:mail@example.com">mail@example.com</a>
        <a href="https://github.com/Archive-At-Home/archive-at-home" target="_blank" rel="noopener">主仓库（Server / Node）</a>
        <a :href="mainHome" target="_self">主站首页</a>
        <a href="https://github.com/Archive-At-Home/archive-at-home.user.js" target="_blank" rel="noopener">油猴脚本</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.docs-footer {
  width: 100%;
  margin-top: 32px;
  margin-bottom: 0;
}
</style>

import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import ApiReference from './components/ApiReference.vue'
import NotFound from './components/NotFound.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteNavbar from './components/SiteNavbar.vue'
import UnifiedLocalNav from './components/UnifiedLocalNav.vue'
import '../../../site/assets/site-shell.js'
import './style.css'

const theme: Theme = {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(SiteNavbar),
      'doc-top': () => h(UnifiedLocalNav),
      'page-top': () => h(UnifiedLocalNav),
      'layout-bottom': () => h(SiteFooter),
      'not-found': () => h(NotFound),
    })
  },
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('ApiReference', ApiReference)
  },
}

export default theme

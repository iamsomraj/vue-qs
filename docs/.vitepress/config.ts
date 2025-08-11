import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
const base = process.env.DOCS_BASE ?? '/';

export default defineConfig({
  base,
  lang: 'en-US',
  title: 'vue-qs',
  description: 'Type-safe URL query params state for Vue 3',
  titleTemplate: 'vue-qs',
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { property: 'og:title', content: 'vue-qs' }],
    [
      'meta',
      { property: 'og:description', content: 'Type-safe, reactive URL query params for Vue 3' },
    ],
    ['meta', { property: 'og:image', content: `${base}og-image.svg` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      link: '/',
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
    },
  },
  themeConfig: {
    logo: { src: '/logo.svg', alt: 'vue-qs' },
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/iamsomraj/vue-qs' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Examples', link: '/guide/examples' },
            { text: 'Vue Router', link: '/guide/vue-router' },
            { text: 'Two-way Sync', link: '/guide/two-way-sync' },
            { text: 'Serializers', link: '/guide/serializers' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API',
          items: [{ text: 'Reference', link: '/api/' }],
        },
      ],
      '/zh/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/zh/guide/getting-started' },
            { text: '示例', link: '/zh/guide/examples' },
            { text: 'Vue Router', link: '/zh/guide/vue-router' },
            { text: '双向同步', link: '/zh/guide/two-way-sync' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/iamsomraj/vue-qs' }],
    editLink: {
      pattern: 'https://github.com/iamsomraj/vue-qs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2023-${new Date().getFullYear()} Somraj Mukherjee`,
    },
  },
});

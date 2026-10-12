import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
const base = process.env.DOCS_BASE ?? '/';

export default defineConfig({
  base,
  lang: 'en-US',
  title: 'vue-qs',
  description: 'Type-safe search params state manager for Vue 3 - a port of nuqs',
  titleTemplate: 'vue-qs',
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { property: 'og:title', content: 'vue-qs' }],
    [
      'meta',
      { property: 'og:description', content: 'Type-safe search params state manager for Vue 3' },
    ],
    ['meta', { property: 'og:image', content: `${base}og-image.svg` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      link: '/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          { text: 'API', link: '/api/' },
          { text: 'GitHub', link: 'https://github.com/iamsomraj/vue-qs' },
        ],
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/getting-started' },
          { text: 'API', link: '/zh/api/' },
          { text: 'GitHub', link: 'https://github.com/iamsomraj/vue-qs' },
        ],
      },
    },
  },
  themeConfig: {
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Parsers', link: '/guide/parsers' },
            { text: 'Options', link: '/guide/options' },
            { text: 'Adapters', link: '/guide/adapters' },
            { text: 'Server', link: '/guide/server' },
            { text: 'Testing', link: '/guide/testing' },
            { text: 'Examples', link: '/guide/examples' },
            { text: 'Migrating from 0.1.x', link: '/guide/migration' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API',
          items: [{ text: 'Reference', link: '/api/' }],
        },
      ],
      '/zh/api/': [
        {
          text: 'API',
          items: [{ text: 'API 参考', link: '/zh/api/' }],
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

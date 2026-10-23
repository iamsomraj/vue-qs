import { defineConfig, type HeadConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
const base = process.env.DOCS_BASE ?? '/';
const siteUrl = 'https://iamsomraj.github.io/vue-qs/';
const siteDescription = 'Type-safe search params state manager for Vue 3 - a port of nuqs';
const ogImage = `${siteUrl}og-image.png`;

export default defineConfig({
  base,
  lang: 'en-US',
  title: 'vue-qs',
  description: siteDescription,
  titleTemplate: ':title | vue-qs',
  lastUpdated: true,
  cleanUrls: true,
  sitemap: {
    hostname: siteUrl,
    // TypeDoc emits api/README.md as a duplicate of api/index.md
    transformItems: (items) => items.filter((item) => !item.url.endsWith('README')),
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#42b883' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'vue-qs' }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:image:width', content: '2240' }],
    ['meta', { property: 'og:image:height', content: '1260' }],
    [
      'meta',
      { property: 'og:image:alt', content: 'vue-qs: type-safe search params state for Vue' },
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }],
  ],
  transformHead({ pageData }) {
    // Canonical URL and per-page social metadata
    const path = pageData.relativePath
      .replace(/(^|\/)(index|README)\.md$/, '$1')
      .replace(/\.md$/, '');
    const url = `${siteUrl}${path}`;
    const title = pageData.frontmatter.layout === 'home' ? 'vue-qs' : `${pageData.title} | vue-qs`;
    const description = pageData.description || siteDescription;
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ];
    return head;
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      link: '/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          { text: 'API', link: '/api/' },
          {
            text: 'Community',
            items: [
              { text: 'Discussions', link: 'https://github.com/iamsomraj/vue-qs/discussions' },
              {
                text: 'Ask a question',
                link: 'https://github.com/iamsomraj/vue-qs/discussions/categories/q-a',
              },
              {
                text: 'Good first issues',
                link: 'https://github.com/iamsomraj/vue-qs/labels/good%20first%20issue',
              },
              {
                text: 'Contributing',
                link: 'https://github.com/iamsomraj/vue-qs/blob/main/CONTRIBUTING.md',
              },
            ],
          },
          {
            text: 'v0.2.x',
            items: [
              { text: 'Changelog', link: 'https://github.com/iamsomraj/vue-qs/releases' },
              { text: 'Migrating from 0.1.x', link: '/guide/migration' },
              { text: 'npm', link: 'https://www.npmjs.com/package/vue-qs' },
            ],
          },
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
        ],
      },
    },
  },
  themeConfig: {
    search: {
      provider: 'local',
    },
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
            { text: 'Comparison', link: '/guide/comparison' },
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
      message:
        'Released under the MIT License. Questions or ideas? Join the <a href="https://github.com/iamsomraj/vue-qs/discussions">GitHub Discussions</a>.',
      copyright: `Copyright © 2025-${new Date().getFullYear()} Somraj Mukherjee`,
    },
  },
});

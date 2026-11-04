/**
 * Nuxt module for vue-qs: installs the plugin with the Vue Router adapter and
 * auto-imports the composables and parsers.
 *
 * @example
 * ```ts
 * // nuxt.config.ts
 * export default defineNuxtConfig({
 *   modules: ['vue-qs/nuxt'],
 * })
 * ```
 *
 * @packageDocumentation
 */

import type { DefaultOptions } from '@/adapters/context';

/** Options for the vue-qs Nuxt module, set under `vueQs` in `nuxt.config`. */
export type ModuleOptions = {
  /**
   * Defaults for URL update options, passed to `createVueQs`.
   * Must be serializable to JSON, e.g. `{ history: 'push', limitUrlUpdates: { method: 'debounce', timeMs: 300 } }`.
   */
  defaultOptions?: DefaultOptions;
  /** Auto-import `useQueryState`, `useQueryStates` and the `parseAs*` parsers (default: `true`) */
  autoImports?: boolean;
};

type NuxtTemplate = { filename: string; write?: boolean; getContents: () => string };
type NuxtImportSource = { from: string; imports: string[] };

/** The subset of the Nuxt instance used by the module. */
type Nuxt = {
  options: {
    buildDir: string;
    plugins: unknown[];
    build: { templates: NuxtTemplate[] };
    vueQs?: ModuleOptions;
  };
  hook(name: 'imports:sources', fn: (sources: NuxtImportSource[]) => void): void;
};

/** Names auto-imported from `vue-qs`. */
export const autoImportNames: readonly string[] = [
  'useQueryState',
  'useQueryStates',
  'parseAsString',
  'parseAsInteger',
  'parseAsIndex',
  'parseAsHex',
  'parseAsFloat',
  'parseAsBoolean',
  'parseAsTimestamp',
  'parseAsIsoDateTime',
  'parseAsIsoDate',
  'parseAsStringEnum',
  'parseAsStringLiteral',
  'parseAsNumberLiteral',
  'parseAsJson',
  'parseAsArrayOf',
  'parseAsNativeArrayOf',
];

const PLUGIN_FILENAME = 'vue-qs.plugin.mjs';

function pluginContents(defaultOptions: DefaultOptions | undefined): string {
  const settings = defaultOptions ? `, defaultOptions: ${JSON.stringify(defaultOptions)}` : '';
  return `import { defineNuxtPlugin, useRouter } from '#app';
import { createVueQs } from 'vue-qs';
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router';

export default defineNuxtPlugin({
  name: 'vue-qs',
  setup(nuxtApp) {
    nuxtApp.vueApp.use(createVueQs({ adapter: createVueRouterAdapter(useRouter())${settings} }));
  },
});
`;
}

/**
 * The vue-qs Nuxt module. Add `'vue-qs/nuxt'` to `modules` in `nuxt.config`.
 */
function vueQsNuxtModule(inlineOptions: ModuleOptions, nuxt: Nuxt): void {
  const options: ModuleOptions = { ...nuxt.options.vueQs, ...inlineOptions };

  nuxt.options.build.templates.push({
    filename: PLUGIN_FILENAME,
    write: true,
    getContents: () => pluginContents(options.defaultOptions),
  });
  nuxt.options.plugins.push({ src: `${nuxt.options.buildDir}/${PLUGIN_FILENAME}`, mode: 'all' });

  if (options.autoImports !== false) {
    nuxt.hook('imports:sources', (sources) => {
      sources.push({ from: 'vue-qs', imports: [...autoImportNames] });
    });
  }
}

vueQsNuxtModule.getMeta = () => ({
  name: 'vue-qs',
  configKey: 'vueQs',
  compatibility: { nuxt: '>=3.0.0' },
});

export default vueQsNuxtModule;

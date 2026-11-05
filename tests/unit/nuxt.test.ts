import { describe, expect, it } from 'vitest';
import * as vueQs from '@/index';
import vueQsNuxtModule, { autoImportNames, type ModuleOptions } from '@/nuxt';

function createNuxt(vueQsOptions?: ModuleOptions) {
  const hooks: Record<string, (sources: { from: string; imports: string[] }[]) => void> = {};
  const nuxt = {
    options: {
      buildDir: '/app/.nuxt',
      plugins: [] as unknown[],
      build: { templates: [] as { filename: string; getContents: () => string }[] },
      vueQs: vueQsOptions,
    },
    hook: (name: string, fn: (sources: { from: string; imports: string[] }[]) => void) => {
      hooks[name] = fn;
    },
  };
  return { nuxt, hooks };
}

describe('vue-qs/nuxt', () => {
  it('exposes module meta', () => {
    expect(vueQsNuxtModule.getMeta()).toMatchObject({ name: 'vue-qs', configKey: 'vueQs' });
  });

  it('registers a plugin that installs vue-qs with the Vue Router adapter', () => {
    const { nuxt } = createNuxt();
    vueQsNuxtModule({}, nuxt);

    const [template] = nuxt.options.build.templates;
    expect(nuxt.options.plugins).toEqual([
      { src: `/app/.nuxt/${template!.filename}`, mode: 'all' },
    ]);
    const contents = template!.getContents();
    expect(contents).toContain("from 'vue-qs/adapters/vue-router'");
    expect(contents).toContain('createVueQs({ adapter: createVueRouterAdapter(useRouter()) })');
  });

  it('passes defaultOptions from config and inline options', () => {
    const { nuxt } = createNuxt({ defaultOptions: { history: 'push' } });
    vueQsNuxtModule({ defaultOptions: { scroll: true } }, nuxt);
    expect(nuxt.options.build.templates[0]!.getContents()).toContain(
      'defaultOptions: {"scroll":true}'
    );
  });

  it('auto-imports the composables and every parseAs* parser', () => {
    const { nuxt, hooks } = createNuxt();
    vueQsNuxtModule({}, nuxt);

    const sources: { from: string; imports: string[] }[] = [];
    hooks['imports:sources']!(sources);
    expect(sources).toEqual([{ from: 'vue-qs', imports: [...autoImportNames] }]);

    const exported = Object.keys(vueQs);
    for (const name of autoImportNames) {
      expect(exported).toContain(name);
    }
    const parsers = exported.filter((name) => name.startsWith('parseAs'));
    expect([...autoImportNames].filter((name) => name.startsWith('parseAs')).sort()).toEqual(
      parsers.sort()
    );
  });

  it('skips auto-imports when disabled', () => {
    const { nuxt, hooks } = createNuxt({ autoImports: false });
    vueQsNuxtModule({}, nuxt);
    expect(hooks['imports:sources']).toBeUndefined();
  });
});

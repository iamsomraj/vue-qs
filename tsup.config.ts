import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server.ts',
    'adapters/history': 'src/adapters/history.ts',
    'adapters/vue-router': 'src/adapters/vue-router.ts',
    'adapters/testing': 'src/adapters/testing.ts',
    testing: 'src/testing.ts',
  },
  format: ['esm', 'cjs'],
  dts: {
    // tsup injects `baseUrl` into the declaration build, which TypeScript 6 deprecates
    compilerOptions: { ignoreDeprecations: '6.0' },
  },
  clean: true,
  external: ['vue', 'vue-router'],
});

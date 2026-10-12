import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server.ts',
    'adapters/history': 'src/adapters/history.ts',
    'adapters/vue-router': 'src/adapters/vue-router.ts',
    'adapters/testing': 'src/adapters/testing.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['vue', 'vue-router'],
});

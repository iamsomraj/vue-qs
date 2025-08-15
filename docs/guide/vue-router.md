# Vue Router Integration

When using Vue Router, an adapter keeps your query refs/reactive state in sync with navigations and browser back/forward.

## Per‑hook adapter

Pass the adapter directly when you create refs / reactive objects.

```vue
<script setup lang="ts">
import { queryRef, queryReactive, createVueRouterAdapter } from 'vue-qs';
import { useRouter } from 'vue-router';

const adapter = createVueRouterAdapter(useRouter());

const page = queryRef('page', { defaultValue: 1, parseFunction: Number, queryAdapter: adapter });
const { queryState } = queryReactive({ q: { defaultValue: '' } }, { adapter });
</script>
```

## Global adapter (recommended)

Provide it once so every hook can auto‑detect it.

```ts
// main.ts
import { createApp } from 'vue';
import { createVueQsPlugin, createVueRouterAdapter } from 'vue-qs';
import { router } from './router';
import App from './App.vue';

createApp(App)
  .use(createVueQsPlugin({ queryAdapter: createVueRouterAdapter(router) }))
  .use(router)
  .mount('#app');
```

## Two‑way sync tip

Add `enableTwoWaySync: true` if you want state to update when the user navigates (back/forward or programmatic pushes):

```ts
const page = queryRef('page', {
  defaultValue: 1,
  parseFunction: Number,
  enableTwoWaySync: true,
});
```

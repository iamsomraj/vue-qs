---
description: 'Connect vue-qs to Vue Router, Nuxt, the browser History API, tests or a custom source with adapters.'
---

# Adapters

An adapter connects vue-qs to the URL. Install exactly one per app with the plugin:

```ts
import { createVueQs } from 'vue-qs';

app.use(createVueQs({ adapter }));
```

| Adapter                          | Import                       | Use it for                  |
| -------------------------------- | ---------------------------- | --------------------------- |
| `createVueRouterAdapter(router)` | `vue-qs/adapters/vue-router` | Apps using Vue Router, Nuxt |
| `createHistoryAdapter()`         | `vue-qs/adapters/history`    | Apps without a router       |
| `createTestingAdapter(options)`  | `vue-qs/adapters/testing`    | Unit tests                  |
| `createAdapter(adapter)`         | `vue-qs`                     | Anything else               |

Composables throw a descriptive error when no adapter is installed.

## Vue Router

```ts
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createVueQs } from 'vue-qs';
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router';

const router = createRouter({ history: createWebHistory(), routes });

createApp(App)
  .use(router)
  .use(createVueQs({ adapter: createVueRouterAdapter(router) }))
  .mount('#app');
```

- State follows every navigation: `router.push({ query })`, `<RouterLink>`, Back/Forward.
- URL updates go through `router.replace` / `router.push`, keeping the current path,
  params, hash and other query keys.
- Navigation guards can cancel or redirect an update. The state then follows the
  resulting URL.
- Repeated keys (`?id=1&id=2`) are supported through `parseAsNativeArrayOf`.

## Nuxt

Nuxt uses Vue Router, so use the Vue Router adapter in a plugin:

```ts
// plugins/vue-qs.ts
import { createVueQs } from 'vue-qs';
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createVueQs({ adapter: createVueRouterAdapter(useRouter()) }));
});
```

The plugin runs for each request on the server, so state is never shared between
requests. Composables read the request URL during SSR, then follow client-side
navigation after hydration.

To read search params in server routes or middleware, use
[`createLoader`](./server#createloader).

## History API

For apps without a router:

```ts
import { createVueQs } from 'vue-qs';
import { createHistoryAdapter } from 'vue-qs/adapters/history';

app.use(createVueQs({ adapter: createHistoryAdapter() }));
```

- URL updates use `history.replaceState` / `pushState`, keeping the path and hash.
- State follows Back/Forward (`popstate`) and calls to `pushState` / `replaceState`
  made by other code.
- On the server, search params are empty.

## Providing an adapter to part of the app

Use `provideQueryAdapter` in a parent component's `setup`, or the `VueQsAdapter`
component:

```vue
<script setup lang="ts">
import { VueQsAdapter } from 'vue-qs';
import { createHistoryAdapter } from 'vue-qs/adapters/history';

const adapter = createHistoryAdapter();
</script>

<template>
  <VueQsAdapter :adapter="adapter">
    <Widget />
  </VueQsAdapter>
</template>
```

## Using composables outside components

Composables need an injection context to find the adapter. Inside Pinia setup stores
this works out of the box. Elsewhere, use `app.runWithContext`, and an `effectScope`
to stop listening when you are done:

```ts
const scope = effectScope();
const page = app.runWithContext(() =>
  scope.run(() => useQueryState('page', parseAsInteger.withDefault(1)))
);
// later
scope.stop();
```

## Custom adapters

An adapter implements three functions:

```ts
import { createAdapter } from 'vue-qs';

const adapter = createAdapter({
  // Return the current search params (do not mutate them)
  getSearchParams: () => new URLSearchParams(myStore.search),
  // Write the new search params; may return a promise
  updateUrl: (search, { history, scroll, shallow }) => {
    myStore.navigate(`?${search}`, { replace: history === 'replace' });
  },
  // Call onChange when the URL changes from outside; return an unsubscribe function
  subscribe: (onChange) => myStore.onChange(onChange),
});
```

If the URL does not take an update (for example, a navigation guard cancels or redirects
it), return or resolve `false` from `updateUrl`. Composables then re-read the URL instead
of keeping the rejected value.

Set the optional `rateLimitFactor` to scale throttle delays (`0` disables throttling).

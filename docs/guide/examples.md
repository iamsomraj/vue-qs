---
description: 'vue-qs examples: search with pagination, tabs, multi-select filters, map coordinates, shareable links and validated JSON.'
---

# Examples

## Search with pagination

```vue
<script setup lang="ts">
import { watch } from 'vue';
import { debounce, parseAsInteger, parseAsString, useQueryStates } from 'vue-qs';

const filters = useQueryStates({
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
});

function onSearch(event: Event) {
  const q = (event.target as HTMLInputElement).value;
  // Reset the page with the same URL update, debounce typing
  filters.$set({ q, page: 1 }, { limitUrlUpdates: q === '' ? undefined : debounce(300) });
}

watch(
  () => ({ q: filters.q, page: filters.page }),
  ({ q, page }) => loadResults(q, page),
  { immediate: true }
);
</script>

<template>
  <input :value="filters.q" placeholder="Search…" @input="onSearch" />
  <button :disabled="filters.page === 1" @click="filters.page--">Previous</button>
  <span>Page {{ filters.page }}</span>
  <button @click="filters.page++">Next</button>
</template>
```

## Tabs with history

```vue
<script setup lang="ts">
import { parseAsStringLiteral, useQueryState } from 'vue-qs';

const tabs = ['overview', 'settings', 'billing'] as const;
const tab = useQueryState(
  'tab',
  parseAsStringLiteral(tabs).withDefault('overview').withOptions({ history: 'push' })
);
</script>

<template>
  <nav>
    <button v-for="name in tabs" :key="name" :aria-pressed="tab === name" @click="tab = name">
      {{ name }}
    </button>
  </nav>
</template>
```

## Multi-select filters

```vue
<script setup lang="ts">
import { parseAsArrayOf, parseAsString, useQueryState } from 'vue-qs';

const options = ['vue', 'nuxt', 'vite'];
const selected = useQueryState('tags', parseAsArrayOf(parseAsString).withDefault([]));
</script>

<template>
  <label v-for="option in options" :key="option">
    <input v-model="selected" type="checkbox" :value="option" />
    {{ option }}
  </label>
  <!-- ?tags=vue,vite -->
</template>
```

`v-model` on checkboxes assigns a new array, so the URL updates.

## Map coordinates with short URL keys

```ts
import { parseAsFloat, useQueryStates } from 'vue-qs';

const coordinates = useQueryStates(
  {
    latitude: parseAsFloat.withDefault(0),
    longitude: parseAsFloat.withDefault(0),
  },
  { urlKeys: { latitude: 'lat', longitude: 'lng' } }
);

coordinates.$set({ latitude: 48.8566, longitude: 2.3522 }); // ?lat=48.8566&lng=2.3522
```

## Shareable links

```vue
<script setup lang="ts">
import { createSerializer, parseAsInteger, parseAsString } from 'vue-qs';

const serialize = createSerializer({
  q: parseAsString,
  page: parseAsInteger.withDefault(1),
});
</script>

<template>
  <RouterLink :to="serialize('/search', { q: 'vue' })">Search for Vue</RouterLink>
</template>
```

## Validated JSON state

```ts
import { z } from 'zod';
import { parseAsJson, useQueryState } from 'vue-qs';

const filtersSchema = z.object({
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
});

const filters = useQueryState('filters', parseAsJson(filtersSchema).withDefault({}));
filters.value = { ...filters.value, inStock: true };
```

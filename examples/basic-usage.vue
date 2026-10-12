<script setup lang="ts">
/**
 * Example: product list filters stored in the URL.
 *
 * Requires the plugin to be installed:
 *   app.use(createVueQs({ adapter: createVueRouterAdapter(router) }))
 */
import { toRefs } from 'vue';
import {
  debounce,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
  useQueryStates,
} from 'vue-qs';

const sortOptions = ['name', 'price', 'date'] as const;
const categories = ['books', 'music', 'games'];

// One key, typed with a default value: Ref<number>
const page = useQueryState('page', parseAsInteger.withDefault(1));

// Several keys in one reactive object
const filters = useQueryStates(
  {
    search: parseAsString.withDefault(''),
    sort: parseAsStringLiteral(sortOptions).withDefault('name'),
    inStock: parseAsBoolean.withDefault(false),
    categories: parseAsArrayOf(parseAsString).withDefault([]),
  },
  { urlKeys: { search: 'q', categories: 'cat' } }
);
const { sort, inStock, categories: selectedCategories } = toRefs(filters);

function onSearch(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  // Debounce typing, reset the page in the same URL update
  void filters.$set({ search: value }, { limitUrlUpdates: debounce(300) });
  void page.set(null);
}

function resetAll(): void {
  void filters.$set(null);
  void page.set(null);
}
</script>

<template>
  <section>
    <input :value="filters.search" placeholder="Search…" @input="onSearch" />

    <select v-model="sort">
      <option v-for="option in sortOptions" :key="option" :value="option">{{ option }}</option>
    </select>

    <label><input v-model="inStock" type="checkbox" /> In stock</label>

    <label v-for="category in categories" :key="category">
      <input v-model="selectedCategories" type="checkbox" :value="category" />
      {{ category }}
    </label>

    <nav>
      <button :disabled="page === 1" @click="page--">Previous</button>
      <span>Page {{ page }}</span>
      <button @click="page++">Next</button>
    </nav>

    <button @click="resetAll">Reset</button>
  </section>
</template>

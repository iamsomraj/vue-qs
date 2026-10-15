<script setup lang="ts">
import { computed, toRefs } from 'vue';
import {
  debounce,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
  useQueryStates,
} from 'vue-qs';

const tabs = ['all', 'books', 'music', 'games'] as const;
const sortOptions = ['name', 'price'] as const;
const pageSize = 5;

type Category = Exclude<(typeof tabs)[number], 'all'>;

const products: { name: string; price: number; category: Category }[] = [
  { name: 'Dune', price: 12, category: 'books' },
  { name: 'Neuromancer', price: 10, category: 'books' },
  { name: 'The Hobbit', price: 9, category: 'books' },
  { name: 'Foundation', price: 11, category: 'books' },
  { name: 'Hyperion', price: 13, category: 'books' },
  { name: 'Kind of Blue', price: 15, category: 'music' },
  { name: 'Abbey Road', price: 18, category: 'music' },
  { name: 'Thriller', price: 14, category: 'music' },
  { name: 'Rumours', price: 16, category: 'music' },
  { name: 'Blue Train', price: 17, category: 'music' },
  { name: 'Celeste', price: 20, category: 'games' },
  { name: 'Hades', price: 25, category: 'games' },
  { name: 'Portal 2', price: 10, category: 'games' },
  { name: 'Stardew Valley', price: 15, category: 'games' },
  { name: 'Outer Wilds', price: 25, category: 'games' },
];

// Tab changes push a history entry: Back / Forward move between tabs
const tab = useQueryState(
  'tab',
  parseAsStringLiteral(tabs).withDefault('all').withOptions({ history: 'push' })
);

// Filters replace the current entry (the default)
const filters = useQueryStates({
  q: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(sortOptions).withDefault('name'),
  page: parseAsInteger.withDefault(1),
});
const { sort, page } = toRefs(filters);

const results = computed(() => {
  const q = filters.q.toLowerCase();
  return products
    .filter((product) => tab.value === 'all' || product.category === tab.value)
    .filter((product) => product.name.toLowerCase().includes(q))
    .sort((a, b) => (sort.value === 'price' ? a.price - b.price : a.name.localeCompare(b.name)));
});
const pageCount = computed(() => Math.max(1, Math.ceil(results.value.length / pageSize)));
const visible = computed(() =>
  results.value.slice((page.value - 1) * pageSize, page.value * pageSize)
);

function onSearch(event: Event): void {
  const q = (event.target as HTMLInputElement).value;
  // Debounce typing, reset the page in the same URL update
  void filters.$set({ q, page: null }, { limitUrlUpdates: debounce(300) });
}

function selectTab(value: (typeof tabs)[number]): void {
  void tab.set(value);
  void filters.$set({ page: null });
}

function resetAll(): void {
  void filters.$set(null);
  void tab.set(null);
}
</script>

<template>
  <section>
    <nav class="tabs">
      <button
        v-for="option in tabs"
        :key="option"
        :class="{ active: tab === option }"
        @click="selectTab(option)"
      >
        {{ option }}
      </button>
    </nav>
    <p class="hint">Switch tabs, then press the browser's Back button.</p>

    <div class="filters">
      <input :value="filters.q" placeholder="Search…" @input="onSearch" />
      <select v-model="sort">
        <option v-for="option in sortOptions" :key="option" :value="option">
          Sort by {{ option }}
        </option>
      </select>
      <button @click="resetAll">Reset</button>
    </div>

    <ul>
      <li v-for="product in visible" :key="product.name">
        {{ product.name }} <small>({{ product.category }}, ${{ product.price }})</small>
      </li>
      <li v-if="visible.length === 0">No products found.</li>
    </ul>

    <nav class="pager">
      <button :disabled="page <= 1" @click="page--">Previous</button>
      <span>Page {{ page }} of {{ pageCount }}</span>
      <button :disabled="page >= pageCount" @click="page++">Next</button>
    </nav>
  </section>
</template>

<style scoped>
.tabs,
.filters,
.pager {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.tabs button {
  text-transform: capitalize;
}
.tabs button.active {
  font-weight: bold;
}
.hint {
  color: #64748b;
  font-size: 0.9rem;
}
</style>

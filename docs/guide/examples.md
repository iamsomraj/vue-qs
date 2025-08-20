# Examples

## Basic Form Component

A complete Vue component demonstrating different query parameter types using `queryRef`:

```vue
<script setup lang="ts">
import { serializers, queryRef } from 'vue-qs';

const name = queryRef('name', { defaultValue: '', parse: String });

const itemCount = queryRef('itemCount', { defaultValue: 0, codec: serializers.numberCodec });

const isPublished = queryRef('isPublished', {
  defaultValue: false,
  codec: serializers.booleanCodec,
});

const tags = queryRef<string[]>('tags', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.stringCodec),
});
</script>

<template>
  <div class="form-container">
    <h2>Basic Form Example</h2>

    <div class="field">
      <label>Name:</label>
      <input v-model="name" placeholder="Your name" />
    </div>

    <div class="field">
      <label>Item Count:</label>
      <input v-model="itemCount" type="number" placeholder="Item count" />
    </div>

    <div class="field">
      <label>
        <input v-model="isPublished" type="checkbox" />
        Is Published
      </label>
    </div>

    <div class="field">
      <label>Tags:</label>
      <select v-model="tags" multiple>
        <option v-for="tag in ['vue', 'javascript', 'frontend', 'backend']" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </select>
    </div>

    <div class="output">
      <h3>Current State:</h3>
      <pre>{{ JSON.stringify({ name, itemCount, isPublished, tags }, null, 2) }}</pre>
    </div>
  </div>
</template>
```

## Mixed queryRef and queryReactive Component

A component demonstrating both `queryRef` and `queryReactive` together:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { serializers, queryRef, queryReactive } from 'vue-qs';

// Individual queryRef for category selection
const category = queryRef<'books' | 'music' | 'games'>('category', {
  defaultValue: 'books',
  codec: serializers.createEnumCodec(['books', 'music', 'games'] as const),
});

// queryReactive for grouped filter state
const filters = queryReactive({
  search: { defaultValue: '' },
  page: { defaultValue: 1, codec: serializers.numberCodec },
  minPrice: { defaultValue: 0, codec: serializers.numberCodec },
  maxPrice: { defaultValue: 1000, codec: serializers.numberCodec },
  inStock: { defaultValue: false, codec: serializers.booleanCodec },
});

// Computed property that combines both states
const searchSummary = computed(() => ({
  category: category.value,
  totalFilters: Object.values(filters).filter(Boolean).length,
  ...filters,
}));

// Method to reset all filters at once
const resetFilters = () => {
  filters.search = '';
  filters.page = 1;
  filters.minPrice = 0;
  filters.maxPrice = 1000;
  filters.inStock = false;
};

// Method to apply quick filters
const applyQuickFilter = (type: 'cheap' | 'expensive' | 'available') => {
  switch (type) {
    case 'cheap':
      filters.minPrice = 0;
      filters.maxPrice = 50;
      filters.inStock = true;
      break;
    case 'expensive':
      filters.minPrice = 500;
      filters.maxPrice = 1000;
      break;
    case 'available':
      filters.inStock = true;
      filters.page = 1;
      break;
  }
};
</script>

<template>
  <div class="search-container">
    <h2>Product Search</h2>

    <!-- Category selection using queryRef -->
    <div class="section">
      <h3>Category (queryRef)</h3>
      <div class="category-buttons">
        <button
          v-for="cat in ['books', 'music', 'games']"
          :key="cat"
          :class="{ active: category === cat }"
          @click="category = cat"
        >
          {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
        </button>
      </div>
    </div>

    <!-- Filters using queryReactive -->
    <div class="section">
      <h3>Filters (queryReactive)</h3>

      <div class="field">
        <label>Search:</label>
        <input v-model="filters.search" placeholder="Search products..." />
      </div>

      <div class="field">
        <label>Page:</label>
        <input v-model="filters.page" type="number" min="1" />
      </div>

      <div class="field-group">
        <div class="field">
          <label>Min Price:</label>
          <input v-model="filters.minPrice" type="number" min="0" />
        </div>

        <div class="field">
          <label>Max Price:</label>
          <input v-model="filters.maxPrice" type="number" min="0" />
        </div>
      </div>

      <div class="field">
        <label>
          <input v-model="filters.inStock" type="checkbox" />
          In Stock Only
        </label>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="section">
      <h3>Quick Filters</h3>
      <div class="quick-buttons">
        <button @click="applyQuickFilter('cheap')">Cheap Items</button>
        <button @click="applyQuickFilter('expensive')">Expensive Items</button>
        <button @click="applyQuickFilter('available')">Available Items</button>
        <button @click="resetFilters()" class="reset">Reset All</button>
      </div>
    </div>

    <!-- State display -->
    <div class="output">
      <h3>Current Search State:</h3>
      <pre>{{ JSON.stringify(searchSummary, null, 2) }}</pre>
    </div>
  </div>
</template>
```

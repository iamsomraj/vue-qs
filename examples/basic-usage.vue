<template>
  <div class="vue-qs-example">
    <h1>vue-qs Examples</h1>

    <!-- Basic String Parameter -->
    <section>
      <h2>Basic String Parameter</h2>
      <input v-model="searchQuery" placeholder="Search query..." class="input" />
      <p>
        URL: <code>{{ currentUrl }}</code>
      </p>
    </section>

    <!-- Number Parameter -->
    <section>
      <h2>Number Parameter</h2>
      <div class="controls">
        <button @click="currentPage--" :disabled="currentPage <= 1">Previous</button>
        <span>Page {{ currentPage }}</span>
        <button @click="currentPage++">Next</button>
      </div>
      <p>
        URL: <code>{{ currentUrl }}</code>
      </p>
    </section>

    <!-- Boolean Parameter -->
    <section>
      <h2>Boolean Parameter</h2>
      <label>
        <input type="checkbox" v-model="showDetails" />
        Show Details
      </label>
      <p>
        URL: <code>{{ currentUrl }}</code>
      </p>
    </section>

    <!-- Array Parameter -->
    <section>
      <h2>Array Parameter</h2>
      <div class="tags">
        <label v-for="tag in availableTags" :key="tag">
          <input type="checkbox" :value="tag" v-model="selectedTags" />
          {{ tag }}
        </label>
      </div>
      <p>
        URL: <code>{{ currentUrl }}</code>
      </p>
    </section>

    <!-- JSON Object Parameter -->
    <section>
      <h2>JSON Object Parameter</h2>
      <div class="filters">
        <select v-model="filters.category">
          <option value="all">All Categories</option>
          <option value="tech">Technology</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>
        <select v-model="filters.sort">
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
          <option value="popularity">Sort by Popularity</option>
        </select>
      </div>
      <p>
        URL: <code>{{ currentUrl }}</code>
      </p>
    </section>

    <!-- Enum Parameter -->
    <section>
      <h2>Enum Parameter</h2>
      <div class="sort-controls">
        <button @click="sortOrder = 'asc'" :class="{ active: sortOrder === 'asc' }">
          Ascending
        </button>
        <button @click="sortOrder = 'desc'" :class="{ active: sortOrder === 'desc' }">
          Descending
        </button>
      </div>
      <p>
        URL: <code>{{ currentUrl }}</code>
      </p>
    </section>

    <!-- Reactive Object Example -->
    <section>
      <h2>Reactive Object (Multiple Parameters)</h2>
      <div class="reactive-example">
        <input v-model="queryState.search" placeholder="Search..." class="input" />
        <input v-model.number="queryState.limit" type="number" min="1" max="100" class="input" />
        <label>
          <input type="checkbox" v-model="queryState.includeArchived" />
          Include Archived
        </label>
      </div>
      <p>
        URL: <code>{{ currentUrl }}</code>
      </p>
    </section>

    <!-- URL Display -->
    <section class="url-display">
      <h2>Current URL</h2>
      <div class="url-box">
        <code>{{ currentUrl }}</code>
      </div>
      <button @click="copyUrl" class="copy-btn">Copy URL</button>
    </section>

    <!-- Browser Navigation Test -->
    <section>
      <h2>Browser Navigation Test</h2>
      <p>Try using browser back/forward buttons to see URL synchronization in action!</p>
      <div class="navigation-test">
        <button @click="setTestState">Set Test State</button>
        <button @click="clearAll">Clear All</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  queryRef,
  queryReactive,
  numberCodec,
  booleanCodec,
  dateISOCodec,
  createArrayCodec,
  createJsonCodec,
  createEnumCodec,
  stringCodec,
} from 'vue-qs';

// Basic string parameter
const searchQuery = queryRef('q', {
  defaultValue: '',
  shouldOmitDefault: true,
});

// Number parameter with codec
const currentPage = queryRef('page', {
  defaultValue: 1,
  codec: numberCodec,
  shouldOmitDefault: true,
});

// Boolean parameter
const showDetails = queryRef('details', {
  defaultValue: false,
  codec: booleanCodec,
  shouldOmitDefault: true,
});

// Array parameter
const availableTags = ['vue', 'react', 'angular', 'svelte', 'typescript'];
const selectedTags = queryRef('tags', {
  defaultValue: [] as string[],
  codec: createArrayCodec(stringCodec),
  shouldOmitDefault: true,
});

// JSON object parameter
interface Filters {
  category: string;
  sort: 'name' | 'date' | 'popularity';
}

const filters = queryRef('filters', {
  defaultValue: { category: 'all', sort: 'name' } as Filters,
  codec: createJsonCodec<Filters>(),
  shouldOmitDefault: true,
});

// Enum parameter
const sortOrder = queryRef('sort', {
  defaultValue: 'asc' as const,
  codec: createEnumCodec(['asc', 'desc']),
  shouldOmitDefault: true,
});

// Reactive object with multiple parameters
const queryState = queryReactive({
  search: {
    defaultValue: '',
    shouldOmitDefault: true,
  },
  limit: {
    defaultValue: 10,
    codec: numberCodec,
    shouldOmitDefault: true,
  },
  includeArchived: {
    defaultValue: false,
    codec: booleanCodec,
    shouldOmitDefault: true,
  },
});

// Computed current URL
const currentUrl = computed(() => {
  return window.location.href;
});

// Utility functions
const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    alert('URL copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy URL:', err);
  }
};

const setTestState = () => {
  searchQuery.value = 'test search';
  currentPage.value = 5;
  showDetails.value = true;
  selectedTags.value = ['vue', 'typescript'];
  filters.value = { category: 'tech', sort: 'date' };
  sortOrder.value = 'desc';
  queryState.search = 'reactive search';
  queryState.limit = 25;
  queryState.includeArchived = true;
};

const clearAll = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  showDetails.value = false;
  selectedTags.value = [];
  filters.value = { category: 'all', sort: 'name' };
  sortOrder.value = 'asc';
  queryState.search = '';
  queryState.limit = 10;
  queryState.includeArchived = false;
};
</script>

<style scoped>
.vue-qs-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 40px;
}

h2 {
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-top: 30px;
}

section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  background: #f8f9fa;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 10px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

button {
  padding: 8px 16px;
  border: 1px solid #3498db;
  background: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #2980b9;
}

button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.tags label {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.filters select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.sort-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.sort-controls button {
  background: #ecf0f1;
  color: #2c3e50;
  border: 1px solid #bdc3c7;
}

.sort-controls button.active {
  background: #3498db;
  color: white;
}

.reactive-example {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.url-display {
  background: #2c3e50;
  color: white;
}

.url-box {
  background: #34495e;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 10px;
  overflow-x: auto;
}

.url-box code {
  color: #3498db;
  word-break: break-all;
}

.copy-btn {
  background: #27ae60;
  border-color: #27ae60;
}

.copy-btn:hover {
  background: #229954;
}

.navigation-test {
  display: flex;
  gap: 10px;
}

code {
  background: #f1f2f6;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
}

p {
  margin: 10px 0;
  line-height: 1.5;
}
</style>

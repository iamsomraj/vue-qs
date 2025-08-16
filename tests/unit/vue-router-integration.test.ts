import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createApp, defineComponent, nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import {
  queryRef,
  queryReactive,
  createVueRouterAdapter,
  createVueQsPlugin,
} from '../../src/index';

describe('Vue Router Integration Tests', () => {
  let container: HTMLDivElement;
  let router: any;

  beforeEach(async () => {
    // Setup a proper URL environment
    const url = new URL('http://localhost:3000/');
    Object.defineProperty(window, 'location', {
      value: {
        href: url.href,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
      },
      writable: true,
    });

    // Mock history with proper state tracking
    Object.defineProperty(window, 'history', {
      value: {
        replaceState: vi.fn((state: any, title: string, path: string) => {
          const [pathname, search = ''] = path.split('?');
          window.location.pathname = pathname;
          window.location.search = search ? `?${search}` : '';
          window.location.href = `http://localhost:3000${path}`;
        }),
        pushState: vi.fn((state: any, title: string, path: string) => {
          const [pathname, search = ''] = path.split('?');
          window.location.pathname = pathname;
          window.location.search = search ? `?${search}` : '';
          window.location.href = `http://localhost:3000${path}`;
        }),
      },
      writable: true,
    });

    // Create test container
    container = document.createElement('div');
    document.body.appendChild(container);

    // Create Vue Router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/search', component: { template: '<div>Search</div>' } },
      ],
    });
  });

  afterEach(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('should work with Vue Router and queryRef', async () => {
    const SearchPage = defineComponent({
      setup() {
        const searchQuery = queryRef('q', {
          defaultValue: '',
        });

        const resultCount = queryRef('count', {
          defaultValue: 0,
          parse: (v) => (v ? parseInt(v, 10) : 0),
          serializeFunction: (v) => String(v),
        });

        const performSearch = () => {
          if (searchQuery.value) {
            resultCount.value = searchQuery.value.length * 10; // Mock search results
          }
        };

        return { searchQuery, resultCount, performSearch };
      },
      template: `
        <div>
          <input v-model="searchQuery" data-testid="search-input" placeholder="Search..." />
          <button @click="performSearch" data-testid="search-btn">Search</button>
          <div data-testid="results">Found {{ resultCount }} results</div>
        </div>
      `,
    });

    const app = createApp(SearchPage);
    app.use(router);
    app.mount(container);
    await nextTick();

    const input = container.querySelector('[data-testid="search-input"]') as HTMLInputElement;
    const button = container.querySelector('[data-testid="search-btn"]') as HTMLButtonElement;
    const results = container.querySelector('[data-testid="results"]');

    // Initial state
    expect(input.value).toBe('');
    expect(results?.textContent).toBe('Found 0 results');

    // Simulate user typing
    input.value = 'vue';
    input.dispatchEvent(new Event('input'));
    await nextTick();

    // Click search
    button.click();
    await nextTick();

    // Check results updated
    expect(results?.textContent).toBe('Found 30 results');

    app.unmount();
  });

  it('should work with queryReactive for multiple parameters', async () => {
    const FilterPage = defineComponent({
      setup() {
        const filters = queryReactive({
          category: {
            defaultValue: 'all',
          },
          minPrice: {
            defaultValue: 0,
            parse: (v) => (v ? parseInt(v, 10) : 0),
            serializeFunction: (v) => String(v),
          },
          sortBy: {
            defaultValue: 'name',
          },
        });

        const applyFilters = () => {
          // Mock filter application
        };

        return { filters, applyFilters };
      },
      template: `
        <div>
          <select v-model="filters.category" data-testid="category">
            <option value="all">All Categories</option>
            <option value="books">Books</option>
            <option value="electronics">Electronics</option>
          </select>
          
          <input v-model.number="filters.minPrice" type="number" data-testid="price" />
          
          <select v-model="filters.sortBy" data-testid="sort">
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          
          <div data-testid="filter-summary">
            Category: {{ filters.category }}, Min Price: {{ filters.minPrice }}, Sort: {{ filters.sortBy }}
          </div>
        </div>
      `,
    });

    const app = createApp(FilterPage);
    app.use(router);
    app.mount(container);
    await nextTick();

    const categorySelect = container.querySelector('[data-testid="category"]') as HTMLSelectElement;
    const priceInput = container.querySelector('[data-testid="price"]') as HTMLInputElement;
    const sortSelect = container.querySelector('[data-testid="sort"]') as HTMLSelectElement;
    const summary = container.querySelector('[data-testid="filter-summary"]');

    // Initial state
    expect(summary?.textContent?.trim()).toBe('Category: all, Min Price: 0, Sort: name');

    // Change category
    categorySelect.value = 'books';
    categorySelect.dispatchEvent(new Event('change'));
    await nextTick();

    // Change price
    priceInput.value = '50';
    priceInput.dispatchEvent(new Event('input'));
    await nextTick();

    // Change sort
    sortSelect.value = 'price';
    sortSelect.dispatchEvent(new Event('change'));
    await nextTick();

    // Check all updates
    expect(summary?.textContent?.trim()).toBe('Category: books, Min Price: 50, Sort: price');

    app.unmount();
  });

  it('should work with Vue Router adapter', async () => {
    const routerAdapter = createVueRouterAdapter(router);

    expect(routerAdapter).toBeDefined();
    expect(typeof routerAdapter.getCurrentQuery).toBe('function');
    expect(typeof routerAdapter.updateQuery).toBe('function');

    // Test basic functionality
    const query = routerAdapter.getCurrentQuery();
    expect(typeof query).toBe('object');

    // Test query updates
    await routerAdapter.updateQuery({ test: 'value' });
    // Note: In a real scenario, this would update the router's current route
  });

  it('should work with vue-qs plugin', async () => {
    const plugin = createVueQsPlugin({
      queryAdapter: createVueRouterAdapter(router),
    });

    expect(plugin).toBeDefined();
    expect(typeof plugin.install).toBe('function');

    const TestComponent = defineComponent({
      setup() {
        const param = queryRef('plugin-test', {
          defaultValue: 'working',
        });
        return { param };
      },
      template: '<div data-testid="plugin-result">{{ param }}</div>',
    });

    const app = createApp(TestComponent);
    app.use(router);
    app.use(plugin);
    app.mount(container);
    await nextTick();

    const result = container.querySelector('[data-testid="plugin-result"]');
    expect(result?.textContent).toBe('working');

    app.unmount();
  });
});

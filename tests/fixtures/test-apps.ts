import { createApp, defineComponent } from 'vue';
import { createRouter, createWebHistory, Router } from 'vue-router';
import {
  queryRef,
  queryReactive,
  createVueQsPlugin,
  createHistoryAdapter,
  createVueRouterAdapter,
  serializers,
  type QueryAdapter,
} from '../../src/index';

// Test components
export const BasicQueryRefComponent = defineComponent({
  name: 'BasicQueryRefComponent',
  setup() {
    const search = queryRef<string>('search', {
      defaultValue: '',
      codec: serializers.stringCodec,
    });

    const page = queryRef<number>('page', {
      defaultValue: 1,
      codec: serializers.numberCodec,
    });

    const enabled = queryRef<boolean>('enabled', {
      defaultValue: false,
      codec: serializers.booleanCodec,
    });

    const tags = queryRef<string[]>('tags', {
      defaultValue: [],
      codec: serializers.createArrayCodec(serializers.stringCodec),
    });

    const sort = queryRef<'asc' | 'desc'>('sort', {
      defaultValue: 'asc',
      codec: serializers.createEnumCodec(['asc', 'desc'] as const),
    });

    return {
      search,
      page,
      enabled,
      tags,
      sort,
    };
  },
  template: `
    <div class="basic-query-ref">
      <h2>Basic QueryRef Component</h2>
      <div class="form-group">
        <label>Search:</label>
        <input v-model="search" type="text" data-testid="search-input" />
        <span data-testid="search-value">{{ search }}</span>
      </div>
      <div class="form-group">
        <label>Page:</label>
        <input v-model.number="page" type="number" data-testid="page-input" />
        <span data-testid="page-value">{{ page }}</span>
      </div>
      <div class="form-group">
        <label>Enabled:</label>
        <input v-model="enabled" type="checkbox" data-testid="enabled-input" />
        <span data-testid="enabled-value">{{ enabled }}</span>
      </div>
      <div class="form-group">
        <label>Tags:</label>
        <input 
          :value="tags.join(',')" 
          @input="tags = $event.target.value.split(',').filter(Boolean)"
          type="text" 
          data-testid="tags-input" 
          placeholder="Comma separated"
        />
        <span data-testid="tags-value">{{ tags.join(',') }}</span>
      </div>
      <div class="form-group">
        <label>Sort:</label>
        <select v-model="sort" data-testid="sort-select">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <span data-testid="sort-value">{{ sort }}</span>
      </div>
    </div>
  `,
});

export const QueryReactiveComponent = defineComponent({
  name: 'QueryReactiveComponent',
  setup() {
    const queryState = queryReactive({
      search: {
        defaultValue: '',
        codec: serializers.stringCodec,
      },
      filters: {
        defaultValue: { category: 'all', status: 'active' },
        codec: serializers.createJsonCodec<{ category: string; status: string }>(),
      },
      page: {
        defaultValue: 1,
        codec: serializers.numberCodec,
      },
    });

    const updateFilters = (newFilters: Partial<{ category: string; status: string }>) => {
      queryState.filters = {
        ...queryState.filters,
        ...(Object.fromEntries(
          Object.entries(newFilters).filter(([_, value]) => value !== undefined)
        ) as { category: string; status: string }),
      };
    };

    const batchUpdate = () => {
      // Update multiple values at once
      queryState.search = 'batch-update';
      queryState.page = 42;
      queryState.filters = { category: 'books', status: 'inactive' };
    };

    return {
      queryState,
      updateFilters,
      batchUpdate,
    };
  },
  template: `
    <div class="query-reactive">
      <h2>QueryReactive Component</h2>
      <div class="form-group">
        <label>Search:</label>
        <input v-model="queryState.search" type="text" data-testid="reactive-search-input" />
        <span data-testid="reactive-search-value">{{ queryState.search }}</span>
      </div>
      <div class="form-group">
        <label>Page:</label>
        <input v-model.number="queryState.page" type="number" data-testid="reactive-page-input" />
        <span data-testid="reactive-page-value">{{ queryState.page }}</span>
      </div>
      <div class="form-group">
        <label>Category:</label>
        <select 
          :value="queryState.filters.category" 
          @change="updateFilters({ category: $event.target.value })"
          data-testid="reactive-category-select"
        >
          <option value="all">All</option>
          <option value="books">Books</option>
          <option value="electronics">Electronics</option>
        </select>
        <span data-testid="reactive-category-value">{{ queryState.filters.category }}</span>
      </div>
      <div class="form-group">
        <label>Status:</label>
        <select 
          :value="queryState.filters.status" 
          @change="updateFilters({ status: $event.target.value })"
          data-testid="reactive-status-select"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span data-testid="reactive-status-value">{{ queryState.filters.status }}</span>
      </div>
      <button @click="batchUpdate" data-testid="batch-update-btn">Batch Update</button>
    </div>
  `,
});

export const VueRouterIntegrationComponent = defineComponent({
  name: 'VueRouterIntegrationComponent',
  setup() {
    const search = queryRef<string>('q', {
      defaultValue: '',
      codec: serializers.stringCodec,
    });

    const category = queryRef<string>('category', {
      defaultValue: 'all',
      codec: serializers.stringCodec,
    });

    const page = queryRef<number>('page', {
      defaultValue: 1,
      codec: serializers.numberCodec,
    });

    return {
      search,
      category,
      page,
    };
  },
  template: `
    <div class="vue-router-integration">
      <h2>Vue Router Integration</h2>
      <div class="form-group">
        <label>Search Query (q):</label>
        <input v-model="search" type="text" data-testid="router-search-input" />
        <span data-testid="router-search-value">{{ search }}</span>
      </div>
      <div class="form-group">
        <label>Category:</label>
        <select v-model="category" data-testid="router-category-select">
          <option value="all">All</option>
          <option value="books">Books</option>
          <option value="electronics">Electronics</option>
        </select>
        <span data-testid="router-category-value">{{ category }}</span>
      </div>
      <div class="form-group">
        <label>Page:</label>
        <input v-model.number="page" type="number" data-testid="router-page-input" />
        <span data-testid="router-page-value">{{ page }}</span>
      </div>
    </div>
  `,
});

// Test routes
export const routes = [
  {
    path: '/',
    name: 'Home',
    component: BasicQueryRefComponent,
  },
  {
    path: '/reactive',
    name: 'Reactive',
    component: QueryReactiveComponent,
  },
  {
    path: '/router',
    name: 'Router',
    component: VueRouterIntegrationComponent,
  },
];

// Helper to create test app with History Adapter
export function createTestAppWithHistoryAdapter(): {
  app: ReturnType<typeof createApp>;
  mount: (container: Element) => void;
  unmount: () => void;
  adapter: QueryAdapter;
} {
  const adapter = createHistoryAdapter();
  const plugin = createVueQsPlugin({ queryAdapter: adapter });

  const App = defineComponent({
    name: 'TestApp',
    components: {
      BasicQueryRefComponent,
      QueryReactiveComponent,
    },
    template: `
      <div class="test-app">
        <h1>Vue-QS Test App (History Adapter)</h1>
        <BasicQueryRefComponent />
        <QueryReactiveComponent />
      </div>
    `,
  });

  const app = createApp(App);
  app.use(plugin);

  return {
    app,
    mount: (container: Element) => app.mount(container),
    unmount: () => app.unmount(),
    adapter,
  };
}

// Helper to create test app with Vue Router Adapter
export function createTestAppWithVueRouter(): {
  app: ReturnType<typeof createApp>;
  router: Router;
  mount: (container: Element) => void;
  unmount: () => void;
  adapter: QueryAdapter;
} {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  const adapter = createVueRouterAdapter(router);
  const plugin = createVueQsPlugin({ queryAdapter: adapter });

  const App = defineComponent({
    name: 'TestApp',
    template: `
      <div class="test-app">
        <h1>Vue-QS Test App (Vue Router)</h1>
        <nav>
          <router-link to="/" data-testid="nav-home">Home</router-link>
          <router-link to="/reactive" data-testid="nav-reactive">Reactive</router-link>
          <router-link to="/router" data-testid="nav-router">Router</router-link>
        </nav>
        <router-view />
      </div>
    `,
  });

  const app = createApp(App);
  app.use(router);
  app.use(plugin);

  return {
    app,
    router,
    mount: (container: Element) => app.mount(container),
    unmount: () => app.unmount(),
    adapter,
  };
}

// Helper to create DOM container for tests
export function createTestContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.id = `test-container-${Math.random().toString(36).substring(7)}`;
  document.body.appendChild(container);
  return container;
}

// Helper to cleanup test container
export function cleanupTestContainer(container: HTMLDivElement): void {
  if (container.parentNode) {
    container.parentNode.removeChild(container);
  }
}

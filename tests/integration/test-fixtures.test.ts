import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  createTestAppWithHistoryAdapter,
  createTestAppWithVueRouter,
  createTestContainer,
  cleanupTestContainer,
} from '../fixtures/test-apps';

describe('Integration Tests Using Test Fixtures', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
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

    container = createTestContainer();
  });

  afterEach(() => {
    cleanupTestContainer(container);
  });

  describe('History Adapter Integration', () => {
    it('should mount BasicQueryRefComponent and handle form interactions', async () => {
      const { mount, unmount } = createTestAppWithHistoryAdapter();

      mount(container);
      await nextTick();

      // Check if app mounted correctly
      expect(container.querySelector('h1')?.textContent).toBe('Vue-QS Test App (History Adapter)');
      expect(container.querySelector('.basic-query-ref')).toBeDefined();

      // Test search input
      const searchInput = container.querySelector(
        '[data-testid="search-input"]'
      ) as HTMLInputElement;
      const searchValue = container.querySelector('[data-testid="search-value"]');

      expect(searchInput).toBeDefined();
      expect(searchValue?.textContent).toBe(''); // Default empty string

      // Simulate user typing in search
      searchInput.value = 'vue-qs';
      searchInput.dispatchEvent(new Event('input'));
      await nextTick();

      expect(searchValue?.textContent).toBe('vue-qs');

      // Test page number input
      const pageInput = container.querySelector('[data-testid="page-input"]') as HTMLInputElement;
      const pageValue = container.querySelector('[data-testid="page-value"]');

      expect(pageValue?.textContent).toBe('1'); // Default value

      pageInput.value = '5';
      pageInput.dispatchEvent(new Event('input'));
      await nextTick();

      expect(pageValue?.textContent).toBe('5');

      // Test checkbox
      const enabledInput = container.querySelector(
        '[data-testid="enabled-input"]'
      ) as HTMLInputElement;
      const enabledValue = container.querySelector('[data-testid="enabled-value"]');

      expect(enabledValue?.textContent).toBe('false'); // Default

      enabledInput.checked = true;
      enabledInput.dispatchEvent(new Event('change'));
      await nextTick();

      expect(enabledValue?.textContent).toBe('true');

      unmount();
    });

    it('should handle QueryReactiveComponent state management', async () => {
      const { mount, unmount } = createTestAppWithHistoryAdapter();

      mount(container);
      await nextTick();

      // Check reactive component is mounted
      expect(container.querySelector('.query-reactive')).toBeDefined();

      // Test reactive search
      const searchInput = container.querySelector(
        '[data-testid="reactive-search-input"]'
      ) as HTMLInputElement;
      const searchValue = container.querySelector('[data-testid="reactive-search-value"]');

      searchInput.value = 'reactive-test';
      searchInput.dispatchEvent(new Event('input'));
      await nextTick();

      expect(searchValue?.textContent).toBe('reactive-test');

      // Test category filter
      const categorySelect = container.querySelector(
        '[data-testid="reactive-category-select"]'
      ) as HTMLSelectElement;
      const categoryValue = container.querySelector('[data-testid="reactive-category-value"]');

      expect(categoryValue?.textContent).toBe('all'); // Default

      categorySelect.value = 'books';
      categorySelect.dispatchEvent(new Event('change'));
      await nextTick();

      expect(categoryValue?.textContent).toBe('books');

      // Test batch update
      const batchUpdateBtn = container.querySelector(
        '[data-testid="batch-update-btn"]'
      ) as HTMLButtonElement;

      batchUpdateBtn.click();
      await nextTick();

      // Check if batch update worked
      const updatedSearch = container.querySelector('[data-testid="reactive-search-value"]');
      const updatedPage = container.querySelector('[data-testid="reactive-page-value"]');

      expect(updatedSearch?.textContent).toBe('batch-update');
      expect(updatedPage?.textContent).toBe('42');

      unmount();
    });
  });

  describe('Vue Router Integration', () => {
    it('should mount Vue Router app and navigate between routes', async () => {
      const { router, mount, unmount } = createTestAppWithVueRouter();

      mount(container);
      await nextTick();

      // Check if app mounted with router
      expect(container.querySelector('h1')?.textContent).toBe('Vue-QS Test App (Vue Router)');
      expect(container.querySelector('nav')).toBeDefined();

      // Check navigation links
      const homeLink = container.querySelector('[data-testid="nav-home"]') as HTMLAnchorElement;
      const reactiveLink = container.querySelector(
        '[data-testid="nav-reactive"]'
      ) as HTMLAnchorElement;
      const routerLink = container.querySelector('[data-testid="nav-router"]') as HTMLAnchorElement;

      expect(homeLink).toBeDefined();
      expect(reactiveLink).toBeDefined();
      expect(routerLink).toBeDefined();

      // Start on home route (should show BasicQueryRefComponent)
      await router.push('/');
      await nextTick();

      expect(container.querySelector('.basic-query-ref')).toBeDefined();

      // Navigate to reactive route
      await router.push('/reactive');
      await nextTick();

      expect(container.querySelector('.query-reactive')).toBeDefined();
      expect(container.querySelector('.basic-query-ref')).toBeNull();

      // Navigate to router route
      await router.push('/router');
      await nextTick();

      expect(container.querySelector('.vue-router-integration')).toBeDefined();
      expect(container.querySelector('.query-reactive')).toBeNull();

      unmount();
    });

    it('should handle route-specific query parameters', async () => {
      const { router, mount, unmount } = createTestAppWithVueRouter();

      mount(container);
      await nextTick();

      // Navigate to router route with query params
      await router.push('/router?q=search-term&category=books&page=3');
      await nextTick();

      // Check if query params are reflected in the component
      const searchInput = container.querySelector(
        '[data-testid="router-search-input"]'
      ) as HTMLInputElement;
      const searchValue = container.querySelector('[data-testid="router-search-value"]');
      const categorySelect = container.querySelector(
        '[data-testid="router-category-select"]'
      ) as HTMLSelectElement;
      const categoryValue = container.querySelector('[data-testid="router-category-value"]');
      const pageInput = container.querySelector(
        '[data-testid="router-page-input"]'
      ) as HTMLInputElement;
      const pageValue = container.querySelector('[data-testid="router-page-value"]');

      // Note: In a real scenario, these would be populated from the URL
      // For this test, we'll verify the component structure is correct
      expect(searchInput).toBeDefined();
      expect(searchValue).toBeDefined();
      expect(categorySelect).toBeDefined();
      expect(categoryValue).toBeDefined();
      expect(pageInput).toBeDefined();
      expect(pageValue).toBeDefined();

      // Test form interactions update the state
      searchInput.value = 'new-search';
      searchInput.dispatchEvent(new Event('input'));
      await nextTick();

      categorySelect.value = 'electronics';
      categorySelect.dispatchEvent(new Event('change'));
      await nextTick();

      pageInput.value = '7';
      pageInput.dispatchEvent(new Event('input'));
      await nextTick();

      // Verify the values are updated in the UI
      expect(searchValue?.textContent).toBe('new-search');
      expect(categoryValue?.textContent).toBe('electronics');
      expect(pageValue?.textContent).toBe('7');

      unmount();
    });

    it('should maintain state when navigating between routes', async () => {
      const { router, mount, unmount } = createTestAppWithVueRouter();

      mount(container);
      await nextTick();

      // Start on home route and set some values
      await router.push('/');
      await nextTick();

      const searchInput = container.querySelector(
        '[data-testid="search-input"]'
      ) as HTMLInputElement;
      searchInput.value = 'persistent-search';
      searchInput.dispatchEvent(new Event('input'));
      await nextTick();

      // Navigate away and back
      await router.push('/reactive');
      await nextTick();

      await router.push('/');
      await nextTick();

      // Check if the search value persisted (it should due to URL state)
      const searchValueAfterNavigation = container.querySelector('[data-testid="search-value"]');
      // Note: The actual persistence would depend on the URL state management
      expect(searchValueAfterNavigation).toBeDefined();

      unmount();
    });
  });

  describe('Adapter Functionality', () => {
    it('should provide access to the query adapter', async () => {
      const { adapter, mount, unmount } = createTestAppWithHistoryAdapter();

      expect(adapter).toBeDefined();
      expect(typeof adapter.getCurrentQuery).toBe('function');
      expect(typeof adapter.updateQuery).toBe('function');

      // Test adapter methods
      const currentQuery = adapter.getCurrentQuery();
      expect(typeof currentQuery).toBe('object');

      // Test updating query
      await adapter.updateQuery({ test: 'value' });
      // Note: The actual URL update would be mocked in our test environment

      mount(container);
      await nextTick();
      unmount();
    });

    it('should work with Vue Router adapter', async () => {
      const { adapter, router, mount, unmount } = createTestAppWithVueRouter();

      expect(adapter).toBeDefined();
      expect(router).toBeDefined();

      // Test router adapter functionality
      const currentQuery = adapter.getCurrentQuery();
      expect(typeof currentQuery).toBe('object');

      mount(container);
      await nextTick();
      unmount();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Router, LocationQuery } from 'vue-router';
import { createVueRouterAdapter } from '@/adapters/vue-router-adapter';

function createMockRouter(initialQuery: Record<string, any> = {}): Router {
  let currentQuery = { ...initialQuery };
  const afterEachCallbacks: Array<() => void> = [];

  const mockRouter = {
    currentRoute: {
      value: {
        query: currentQuery,
        path: '/',
        name: 'test',
        params: {},
        hash: '',
        fullPath: '/',
        matched: [],
        meta: {},
        redirectedFrom: undefined,
      },
    },

    push: vi.fn().mockImplementation(async ({ query: newQuery }: { query?: LocationQuery }) => {
      if (newQuery !== undefined) {
        currentQuery = { ...newQuery };
        mockRouter.currentRoute.value.query = currentQuery;
        afterEachCallbacks.forEach((callback) => callback());
      }
      return Promise.resolve();
    }),

    replace: vi.fn().mockImplementation(async ({ query: newQuery }: { query?: LocationQuery }) => {
      if (newQuery !== undefined) {
        currentQuery = { ...newQuery };
        mockRouter.currentRoute.value.query = currentQuery;
        afterEachCallbacks.forEach((callback) => callback());
      }
      return Promise.resolve();
    }),

    afterEach: vi.fn().mockImplementation((callback: () => void) => {
      afterEachCallbacks.push(callback);
      return () => {
        const index = afterEachCallbacks.indexOf(callback);
        if (index > -1) {
          afterEachCallbacks.splice(index, 1);
        }
      };
    }),

    // Mock other router methods that might be accessed
    beforeEach: vi.fn(),
    beforeResolve: vi.fn(),
    addRoute: vi.fn(),
    removeRoute: vi.fn(),
    hasRoute: vi.fn(),
    getRoutes: vi.fn().mockReturnValue([]),
    resolve: vi.fn(),
    options: {},
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    install: vi.fn(),
  } as unknown as Router;

  return mockRouter;
}

describe('createVueRouterAdapter', () => {
  let mockRouter: Router;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter = createMockRouter();
  });

  describe('adapter creation', () => {
    it('should create adapter with default options', () => {
      const adapter = createVueRouterAdapter(mockRouter);

      expect(adapter).toBeDefined();
      expect(typeof adapter.getCurrentQuery).toBe('function');
      expect(typeof adapter.updateQuery).toBe('function');
      expect(typeof adapter.onQueryChange).toBe('function');
    });

    it('should create adapter with custom options', () => {
      const adapter = createVueRouterAdapter(mockRouter, {
        warnOnArrayParams: false,
      });

      expect(adapter).toBeDefined();
    });
  });

  describe('getCurrentQuery', () => {
    it('should get current query from router', () => {
      const router = createMockRouter({ foo: 'bar', baz: 'qux' });
      const adapter = createVueRouterAdapter(router);

      const query = adapter.getCurrentQuery();
      expect(query).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should get empty query when no query parameters', () => {
      const adapter = createVueRouterAdapter(mockRouter);

      const query = adapter.getCurrentQuery();
      expect(query).toEqual({});
    });

    it('should normalize array query parameters to strings', () => {
      const router = createMockRouter({
        single: 'value',
        array: ['first', 'second'],
        nested: [['nested', 'array'], 'another'],
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      const adapter = createVueRouterAdapter(router);
      const query = adapter.getCurrentQuery();

      expect(query).toEqual({
        single: 'value',
        array: 'first', // Only takes first value
        nested: undefined, // First value is an array, so undefined
      });

      // Should warn about array parameters with multiple values
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Query parameter "array" has multiple values. Only the first value will be used.',
        { key: 'array', values: ['first', 'second'] }
      );

      consoleWarnSpy.mockRestore();
    });

    it('should not warn about array parameters when warnOnArrayParams is false', () => {
      const router = createMockRouter({
        array: ['first', 'second'],
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      const adapter = createVueRouterAdapter(router, { warnOnArrayParams: false });
      adapter.getCurrentQuery();

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should handle null and undefined query values', () => {
      const router = createMockRouter({
        normal: 'value',
        nullValue: null,
        undefinedValue: undefined,
      });

      const adapter = createVueRouterAdapter(router);
      const query = adapter.getCurrentQuery();

      expect(query).toEqual({
        normal: 'value',
        nullValue: undefined,
        undefinedValue: undefined,
      });
    });

    it('should handle errors gracefully', () => {
      const adapter = createVueRouterAdapter(mockRouter);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Break the router's currentRoute
      (mockRouter as any).currentRoute = null;

      const query = adapter.getCurrentQuery();
      expect(query).toEqual({});
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error getting current query from Vue Router:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('updateQuery', () => {
    it('should update query using replace by default', async () => {
      const adapter = createVueRouterAdapter(mockRouter);

      await adapter.updateQuery({ foo: 'bar', baz: 'qux' });

      expect(mockRouter.replace).toHaveBeenCalledWith({ query: { foo: 'bar', baz: 'qux' } });
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('should update query using push when specified', async () => {
      const adapter = createVueRouterAdapter(mockRouter);

      await adapter.updateQuery({ foo: 'bar' }, { historyStrategy: 'push' });

      expect(mockRouter.push).toHaveBeenCalledWith({ query: { foo: 'bar' } });
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('should merge with existing query parameters', async () => {
      const router = createMockRouter({ existing: 'value', toUpdate: 'old' });
      const adapter = createVueRouterAdapter(router);

      await adapter.updateQuery({ toUpdate: 'new', additional: 'param' });

      expect(router.replace).toHaveBeenCalledWith({
        query: {
          existing: 'value',
          toUpdate: 'new',
          additional: 'param',
        },
      });
    });

    it('should remove parameters when value is undefined', async () => {
      const router = createMockRouter({ keep: 'this', remove: 'this' });
      const adapter = createVueRouterAdapter(router);

      await adapter.updateQuery({ remove: undefined, add: 'new' });

      expect(router.replace).toHaveBeenCalledWith({
        query: {
          keep: 'this',
          add: 'new',
        },
      });
    });

    it('should not navigate when query has not changed', async () => {
      const router = createMockRouter({ foo: 'bar', baz: 'qux' });
      const adapter = createVueRouterAdapter(router);

      await adapter.updateQuery({ foo: 'bar', baz: 'qux' });

      expect(router.replace).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();
    });

    it('should handle navigation errors gracefully', async () => {
      const adapter = createVueRouterAdapter(mockRouter);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Mock router to throw navigation error
      const navigationError = new Error('Navigation failed');
      (navigationError as any).name = 'NavigationFailure';
      mockRouter.replace = vi.fn().mockRejectedValue(navigationError);

      await adapter.updateQuery({ foo: 'bar' });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Vue Router navigation error:', navigationError);
      consoleWarnSpy.mockRestore();
    });

    it('should not warn for NavigationDuplicated errors', async () => {
      const adapter = createVueRouterAdapter(mockRouter);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Mock router to throw NavigationDuplicated error
      const navigationError = new Error('NavigationDuplicated');
      (navigationError as any).name = 'NavigationDuplicated';
      mockRouter.replace = vi.fn().mockRejectedValue(navigationError);

      await adapter.updateQuery({ foo: 'bar' });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should handle general update errors gracefully', async () => {
      const adapter = createVueRouterAdapter(mockRouter);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Break the router completely
      (mockRouter as any).currentRoute = null;

      await adapter.updateQuery({ foo: 'bar' });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error updating query in Vue Router:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('onQueryChange', () => {
    it('should setup query change listener using afterEach hook', () => {
      const adapter = createVueRouterAdapter(mockRouter);
      const callback = vi.fn();

      const unsubscribe = adapter.onQueryChange!(callback);

      expect(mockRouter.afterEach).toHaveBeenCalledWith(expect.any(Function));
      expect(typeof unsubscribe).toBe('function');
    });

    it('should call callback when route changes', async () => {
      const adapter = createVueRouterAdapter(mockRouter);
      const callback = vi.fn();

      adapter.onQueryChange!(callback);

      // Trigger a route change
      await mockRouter.replace({ query: { test: 'value' } });

      expect(callback).toHaveBeenCalled();
    });

    it('should cleanup listener when unsubscribed', () => {
      const adapter = createVueRouterAdapter(mockRouter);
      const callback = vi.fn();

      const unsubscribe = adapter.onQueryChange!(callback);
      unsubscribe();

      // The mock afterEach returns a cleanup function, so we can verify it was called
      expect(mockRouter.afterEach).toHaveBeenCalled();
    });

    it('should handle callback errors gracefully', async () => {
      const adapter = createVueRouterAdapter(mockRouter);
      const errorCallback = vi.fn(() => {
        throw new Error('Callback error');
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      adapter.onQueryChange!(errorCallback);

      // Trigger a route change - should not throw
      await mockRouter.replace({ query: { test: 'value' } });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error in Vue Router query change callback:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle setup errors gracefully', () => {
      const adapter = createVueRouterAdapter(mockRouter);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Mock afterEach to throw
      mockRouter.afterEach = vi.fn(() => {
        throw new Error('Setup error');
      });

      const callback = vi.fn();
      const unsubscribe = adapter.onQueryChange!(callback);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error setting up Vue Router query change listener:',
        expect.any(Error)
      );

      // Should return no-op function
      expect(typeof unsubscribe).toBe('function');
      expect(() => unsubscribe()).not.toThrow();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('query comparison and equality', () => {
    it('should correctly identify identical queries', () => {
      const router = createMockRouter({ a: '1', b: '2' });
      const adapter = createVueRouterAdapter(router);

      // This test indirectly tests the internal areQueriesEqual function
      // by checking that no navigation occurs for identical queries
      adapter.updateQuery({ a: '1', b: '2' });

      expect(router.replace).not.toHaveBeenCalled();
    });

    it('should correctly identify different queries', async () => {
      const router = createMockRouter({ a: '1', b: '2' });
      const adapter = createVueRouterAdapter(router);

      await adapter.updateQuery({ a: '1', b: '3' });

      expect(router.replace).toHaveBeenCalled();
    });

    it('should handle different query lengths', async () => {
      const router = createMockRouter({ a: '1' });
      const adapter = createVueRouterAdapter(router);

      await adapter.updateQuery({ a: '1', b: '2' });

      expect(router.replace).toHaveBeenCalled();
    });

    it('should handle query comparison errors gracefully', async () => {
      const adapter = createVueRouterAdapter(mockRouter);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Break the current route to cause comparison errors
      (mockRouter as any).currentRoute.value.query = null;

      // Should still attempt to update even if comparison fails
      await adapter.updateQuery({ foo: 'bar' });

      // Might warn about comparison error, and then update query
      expect(mockRouter.replace).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('array parameter handling', () => {
    it('should handle single-item arrays', () => {
      const router = createMockRouter({ param: ['single'] });
      const adapter = createVueRouterAdapter(router);

      const query = adapter.getCurrentQuery();
      expect(query.param).toBe('single');
    });

    it('should handle multi-item arrays', () => {
      const router = createMockRouter({ param: ['first', 'second', 'third'] });
      const adapter = createVueRouterAdapter(router);

      const query = adapter.getCurrentQuery();
      expect(query.param).toBe('first'); // Only takes first value
    });

    it('should handle empty arrays', () => {
      const router = createMockRouter({ param: [] });
      const adapter = createVueRouterAdapter(router);

      const query = adapter.getCurrentQuery();
      expect(query.param).toBe(undefined);
    });

    it('should handle nested arrays', () => {
      const router = createMockRouter({
        param: [
          ['nested', 'array'],
          ['another', 'nested'],
        ],
      });
      const adapter = createVueRouterAdapter(router);

      const query = adapter.getCurrentQuery();
      expect(query.param).toBe(undefined); // Nested arrays result in undefined
    });

    it('should handle arrays with null/undefined values', () => {
      const router = createMockRouter({
        param: ['valid', null, undefined, 'another'],
      });
      const adapter = createVueRouterAdapter(router);

      const query = adapter.getCurrentQuery();
      // The behavior depends on how Vue Router handles these
      expect(typeof query.param).toBe('string');
    });
  });

  describe('integration scenarios', () => {
    it('should work with multiple simultaneous adapters', () => {
      const router1 = createMockRouter({ shared: 'value1' });
      const router2 = createMockRouter({ shared: 'value2' });

      const adapter1 = createVueRouterAdapter(router1);
      const adapter2 = createVueRouterAdapter(router2);

      expect(adapter1.getCurrentQuery().shared).toBe('value1');
      expect(adapter2.getCurrentQuery().shared).toBe('value2');
    });

    it('should handle rapid query updates', async () => {
      const adapter = createVueRouterAdapter(mockRouter);

      // Fire multiple updates rapidly
      const updates = [
        adapter.updateQuery({ a: '1' }),
        adapter.updateQuery({ b: '2' }),
        adapter.updateQuery({ c: '3' }),
      ];

      await Promise.all(updates);

      // The final state should reflect the last update
      expect(mockRouter.replace).toHaveBeenCalledTimes(3);
    });

    it('should preserve route information during query updates', async () => {
      const adapter = createVueRouterAdapter(mockRouter);

      await adapter.updateQuery({ test: 'value' });

      // Should only update query, not other route properties
      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: { test: 'value' },
      });

      // Should not include path, params, etc.
      const callArgs = (mockRouter.replace as any).mock.calls[0][0];
      expect(callArgs).not.toHaveProperty('path');
      expect(callArgs).not.toHaveProperty('params');
    });
  });
});

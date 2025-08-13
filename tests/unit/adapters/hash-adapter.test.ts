import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHashAdapter } from '@/adapters/hash-adapter';

// Mock window and location
const mockLocation = {
  hash: '',
  href: 'https://example.com/',
  pathname: '/',
  search: '',
};

const mockHistory = {
  pushState: vi.fn(),
  replaceState: vi.fn(),
} as any;

const mockWindow = {
  location: mockLocation,
  history: mockHistory,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
} as any;

// Mock the createRuntimeEnvironment function
vi.mock('@/utils/core-helpers', async () => {
  const actual = await vi.importActual('@/utils/core-helpers');
  return {
    ...actual,
    createRuntimeEnvironment: () => ({
      isBrowser: true,
      windowObject: mockWindow,
    }),
  };
});

describe('createHashAdapter', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    mockLocation.hash = '';
    mockLocation.href = 'https://example.com/';
    mockLocation.pathname = '/';
    mockLocation.search = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('hash mode (default)', () => {
    it('should create adapter with default hash mode', () => {
      const { queryAdapter, mode } = createHashAdapter();

      expect(mode).toBe('hash');
      expect(queryAdapter).toBeDefined();
      expect(typeof queryAdapter.getCurrentQuery).toBe('function');
      expect(typeof queryAdapter.updateQuery).toBe('function');
      expect(typeof queryAdapter.onQueryChange).toBe('function');
    });

    it('should parse query parameters from hash with route', () => {
      mockLocation.hash = '#/some/route?foo=bar&baz=qux';
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should parse empty query from hash without query params', () => {
      mockLocation.hash = '#/some/route';
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual({});
    });

    it('should parse empty query from empty hash', () => {
      mockLocation.hash = '';
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual({});
    });

    it('should update hash with query parameters while preserving route', () => {
      mockLocation.hash = '#/some/route';
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });

      queryAdapter.updateQuery({ foo: 'bar', baz: 'qux' });

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        {},
        '',
        '/?foo=bar&baz=qux#/some/route?foo=bar&baz=qux'
      );
    });

    it('should update hash without route', () => {
      mockLocation.hash = '';
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });

      queryAdapter.updateQuery({ foo: 'bar' });

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/?foo=bar#?foo=bar');
    });

    it('should clear query parameters from hash', () => {
      mockLocation.hash = '#/route?foo=bar';
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });

      queryAdapter.updateQuery({ foo: undefined });

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/#/route');
    });

    it('should use pushState when historyStrategy is push', () => {
      mockLocation.hash = '#/route';
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });

      queryAdapter.updateQuery({ foo: 'bar' }, { historyStrategy: 'push' });

      expect(mockHistory.pushState).toHaveBeenCalled();
      expect(mockHistory.replaceState).not.toHaveBeenCalled();
    });
  });

  describe('hash-params mode', () => {
    it('should create adapter with hash-params mode', () => {
      const { queryAdapter, mode } = createHashAdapter({ mode: 'hash-params' });

      expect(mode).toBe('hash-params');
      expect(queryAdapter).toBeDefined();
    });

    it('should parse query parameters from entire hash', () => {
      mockLocation.hash = '#foo=bar&baz=qux';
      const { queryAdapter } = createHashAdapter({ mode: 'hash-params' });

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should parse empty query from empty hash', () => {
      mockLocation.hash = '';
      const { queryAdapter } = createHashAdapter({ mode: 'hash-params' });

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual({});
    });

    it('should update entire hash with query parameters', () => {
      mockLocation.hash = '#old=value';
      const { queryAdapter } = createHashAdapter({ mode: 'hash-params' });

      queryAdapter.updateQuery({ foo: 'bar', baz: 'qux' });

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        {},
        '',
        '/?old=value&foo=bar&baz=qux#old=value&foo=bar&baz=qux'
      );
    });

    it('should clear hash when all parameters are undefined', () => {
      mockLocation.hash = '#foo=bar';
      const { queryAdapter } = createHashAdapter({ mode: 'hash-params' });

      queryAdapter.updateQuery({ foo: undefined });

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/');
    });
  });

  describe('event handling', () => {
    it('should setup event listeners for hash changes', () => {
      const { queryAdapter } = createHashAdapter();
      const callback = vi.fn();

      const unsubscribe = queryAdapter.onQueryChange!(callback);

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('hashchange', expect.any(Function));
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'vue-qs:hash-change',
        expect.any(Function)
      );

      expect(typeof unsubscribe).toBe('function');
    });

    it('should cleanup event listeners on unsubscribe', () => {
      const { queryAdapter } = createHashAdapter();
      const callback = vi.fn();

      const unsubscribe = queryAdapter.onQueryChange!(callback);
      unsubscribe();

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'hashchange',
        expect.any(Function)
      );
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'vue-qs:hash-change',
        expect.any(Function)
      );
    });

    it('should suppress events when suppressHistoryEvents is true', () => {
      const { queryAdapter } = createHashAdapter({ suppressHistoryEvents: true });
      const callback = vi.fn();

      queryAdapter.onQueryChange!(callback);

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('hashchange', expect.any(Function));
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
      expect(mockWindow.addEventListener).not.toHaveBeenCalledWith(
        'vue-qs:hash-change',
        expect.any(Function)
      );
    });
  });

  describe('edge cases', () => {
    it('should not update when hash would not change', () => {
      mockLocation.hash = '#foo=bar';
      const { queryAdapter } = createHashAdapter({ mode: 'hash-params' });

      // Reset the mocks before testing
      mockHistory.replaceState = vi.fn();
      mockHistory.pushState = vi.fn();

      queryAdapter.updateQuery({ foo: 'bar' });

      expect(mockHistory.replaceState).not.toHaveBeenCalled();
      expect(mockHistory.pushState).not.toHaveBeenCalled();
    });

    it('should handle malformed hash gracefully', () => {
      mockLocation.hash = '#invalid%hash%content';
      const { queryAdapter } = createHashAdapter();

      // Should not throw
      expect(() => {
        const query = queryAdapter.getCurrentQuery();
        expect(query).toEqual({});
      }).not.toThrow();
    });

    it('should handle update errors gracefully', () => {
      const { queryAdapter } = createHashAdapter();

      // Mock history method to throw
      const originalReplaceState = mockHistory.replaceState;
      mockHistory.replaceState = vi.fn(() => {
        throw new Error('History API error');
      });

      // Should not throw
      expect(() => {
        queryAdapter.updateQuery({ foo: 'bar' });
      }).not.toThrow();

      // Restore original
      mockHistory.replaceState = originalReplaceState;
    });
  });

  describe('server-side compatibility', () => {
    beforeEach(() => {
      // Mock server environment
      vi.doMock('@/utils/core-helpers', () => ({
        createRuntimeEnvironment: () => ({
          isBrowser: false,
          windowObject: null,
        }),
        parseSearchString: vi.fn().mockReturnValue({}),
        buildSearchString: vi.fn().mockReturnValue(''),
        mergeObjects: vi.fn((a, b) => ({ ...a, ...b })),
      }));
    });

    it('should work in server environment', async () => {
      // Re-import to get the mocked version
      const { createHashAdapter } = await import('@/adapters/hash-adapter');

      const { queryAdapter } = createHashAdapter();

      // Should not throw on server
      expect(() => {
        queryAdapter.getCurrentQuery();
        queryAdapter.updateQuery({ foo: 'bar' });
        const unsubscribe = queryAdapter.onQueryChange!(() => {
          // No-op callback for testing
        });
        unsubscribe();
      }).not.toThrow();
    });
  });
});

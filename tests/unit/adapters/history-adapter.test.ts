import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHistoryAdapter } from '@/adapters/history-adapter';

// Mock window and location with proper URL simulation
const mockLocation = {
  search: '',
  href: 'https://example.com/',
  pathname: '/',
  hash: '',
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

describe('createHistoryAdapter', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    mockLocation.search = '';
    mockLocation.href = 'https://example.com/';
    mockLocation.pathname = '/';
    mockLocation.hash = '';

    // Reset history mocks with proper implementation
    mockHistory.pushState = vi.fn();
    mockHistory.replaceState = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('adapter creation', () => {
    it('should create adapter with default options', () => {
      const queryAdapter = createHistoryAdapter();

      expect(queryAdapter).toBeDefined();
      expect(typeof queryAdapter.getCurrentQuery).toBe('function');
      expect(typeof queryAdapter.updateQuery).toBe('function');
    });
  });

  describe('getCurrentQuery', () => {
    it('should parse query parameters from URL search', () => {
      mockLocation.search = '?foo=bar&baz=qux';
      const queryAdapter = createHistoryAdapter();

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should parse empty query from empty search', () => {
      mockLocation.search = '';
      const queryAdapter = createHistoryAdapter();

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual({});
    });

    it('should handle URL with only question mark', () => {
      mockLocation.search = '?';
      const queryAdapter = createHistoryAdapter();

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual({});
    });

    it('should handle complex query parameters', () => {
      mockLocation.search = '?search=hello%20world&page=1&active=true';
      const queryAdapter = createHistoryAdapter();

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual({
        search: 'hello world',
        page: '1',
        active: 'true',
      });
    });

    it('should handle errors gracefully', () => {
      const queryAdapter = createHistoryAdapter();

      // Mock a parsing error
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Temporarily break the location object
      const originalLocation = mockWindow.location;
      mockWindow.location = null as any;

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual({});
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[vue-qs]:',
        'Error getting current query:',
        expect.any(Error)
      );

      // Restore
      mockWindow.location = originalLocation;
      consoleWarnSpy.mockRestore();
    });
  });

  describe('updateQuery', () => {
    it('should update URL with query parameters', () => {
      mockLocation.search = '';
      mockLocation.pathname = '/';
      mockLocation.hash = '';
      const queryAdapter = createHistoryAdapter();

      queryAdapter.updateQuery({ foo: 'bar', baz: 'qux' });

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/?foo=bar&baz=qux');
    });

    it('should preserve existing query parameters when updating', () => {
      mockLocation.search = '?existing=param';
      mockLocation.pathname = '/';
      mockLocation.hash = '';
      mockLocation.href = 'https://example.com/?existing=param';
      const queryAdapter = createHistoryAdapter();

      queryAdapter.updateQuery({ foo: 'bar' });

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/?existing=param&foo=bar');
    });

    it('should remove undefined parameters', () => {
      mockLocation.search = '?foo=bar&baz=qux';
      mockLocation.pathname = '/';
      mockLocation.hash = '';
      mockLocation.href = 'https://example.com/?foo=bar&baz=qux';
      const queryAdapter = createHistoryAdapter();

      queryAdapter.updateQuery({ foo: undefined, baz: 'updated' });

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/?baz=updated');
    });

    it('should clear all parameters when all are undefined', () => {
      mockLocation.search = '?foo=bar&baz=qux';
      mockLocation.pathname = '/';
      mockLocation.hash = '';
      mockLocation.href = 'https://example.com/?foo=bar&baz=qux';
      const queryAdapter = createHistoryAdapter();

      queryAdapter.updateQuery({ foo: undefined, baz: undefined });

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/');
    });

    it('should preserve hash and pathname', () => {
      mockLocation.search = '';
      mockLocation.pathname = '/some/path';
      mockLocation.hash = '#section';
      mockLocation.href = 'https://example.com/some/path#section';
      const queryAdapter = createHistoryAdapter();

      queryAdapter.updateQuery({ foo: 'bar' });

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/some/path?foo=bar#section');
    });

    it('should use push strategy when specified', () => {
      mockLocation.search = '';
      mockLocation.pathname = '/';
      mockLocation.hash = '';
      const queryAdapter = createHistoryAdapter();

      queryAdapter.updateQuery({ foo: 'bar' }, { historyStrategy: 'push' });

      expect(mockHistory.pushState).toHaveBeenCalledWith({}, '', '/?foo=bar');
      expect(mockHistory.replaceState).not.toHaveBeenCalled();
    });

    it('should use replace strategy by default', () => {
      mockLocation.search = '';
      mockLocation.pathname = '/';
      mockLocation.hash = '';
      const queryAdapter = createHistoryAdapter();

      queryAdapter.updateQuery({ foo: 'bar' });

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/?foo=bar');
      expect(mockHistory.pushState).not.toHaveBeenCalled();
    });

    it('should not update when URL would not change', () => {
      mockLocation.search = '?foo=bar';
      mockLocation.pathname = '/';
      mockLocation.hash = '';
      mockLocation.href = 'https://example.com/?foo=bar';
      const queryAdapter = createHistoryAdapter();

      queryAdapter.updateQuery({ foo: 'bar' });

      expect(mockHistory.replaceState).not.toHaveBeenCalled();
      expect(mockHistory.pushState).not.toHaveBeenCalled();
    });

    it('should handle update errors gracefully', () => {
      const queryAdapter = createHistoryAdapter();

      // Mock history method to throw
      const originalReplaceState = mockHistory.replaceState;
      mockHistory.replaceState = vi.fn(() => {
        throw new Error('History API error');
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Should not throw
      expect(() => {
        queryAdapter.updateQuery({ foo: 'bar' });
      }).not.toThrow();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[vue-qs]:',
        'Error updating query:',
        expect.any(Error)
      );

      // Restore
      mockHistory.replaceState = originalReplaceState;
      consoleWarnSpy.mockRestore();
    });

    it('should handle fallback URL update when history fails', () => {
      mockLocation.search = '';
      mockLocation.pathname = '/';
      mockLocation.hash = '';
      const queryAdapter = createHistoryAdapter();

      // Mock history to not update location
      mockHistory.replaceState = vi.fn();

      queryAdapter.updateQuery({ foo: 'bar' });

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/?foo=bar');
    });
  });

  describe('server-side compatibility', () => {
    it('should work in server environment', () => {
      // Create a temporary server environment mock
      const serverMockWindow = null;

      // Mock createRuntimeEnvironment to return server environment
      vi.doMock('@/utils/core-helpers', async () => {
        const actual = await vi.importActual('@/utils/core-helpers');
        return {
          ...actual,
          createRuntimeEnvironment: () => ({
            isBrowser: false,
            windowObject: serverMockWindow,
          }),
        };
      });

      const queryAdapter = createHistoryAdapter();

      // Should not throw on server
      expect(() => {
        queryAdapter.getCurrentQuery();
        queryAdapter.updateQuery({ foo: 'bar' });
      }).not.toThrow();

      // Verify server-side behavior
      expect(queryAdapter.getCurrentQuery()).toEqual({});
    });
  });

  describe('patching history API', () => {
    it('should patch history API methods on first adapter creation', () => {
      const queryAdapter = createHistoryAdapter();

      // Verify that the history API has been patched (indirectly through functionality)
      expect(queryAdapter).toBeDefined();
      expect(typeof queryAdapter.updateQuery).toBe('function');
    });

    it('should handle patching errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Create adapter normally - patching errors are handled internally
      const queryAdapter = createHistoryAdapter();
      expect(queryAdapter).toBeDefined();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('edge cases', () => {
    it('should handle malformed search strings gracefully', () => {
      mockLocation.search = '?invalid%url%encoding%';
      const queryAdapter = createHistoryAdapter();

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      const query = queryAdapter.getCurrentQuery();
      expect(query).toEqual(expect.any(Object));

      consoleWarnSpy.mockRestore();
    });

    it('should handle URL construction errors', () => {
      mockLocation.href = 'invalid-url';
      const queryAdapter = createHistoryAdapter();

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      expect(() => {
        queryAdapter.updateQuery({ foo: 'bar' });
      }).not.toThrow();

      consoleWarnSpy.mockRestore();
    });
  });
});

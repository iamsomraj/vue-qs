import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { createHashAdapter } from '@/adapters/hash-adapter';
import { useQueryRef, useQueryReactive } from '@/index';
import { stringCodec, numberCodec } from '@/serializers';

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

describe('Hash Adapter Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.hash = '';
    mockLocation.href = 'https://example.com/';
    mockLocation.pathname = '/';
    mockLocation.search = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useQueryRef with hash adapter', () => {
    it('should work with hash mode', async () => {
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });
      mockLocation.hash = '#/route?name=john';

      const nameRef = useQueryRef('name', {
        defaultValue: '',
        codec: stringCodec,
        queryAdapter,
      });

      expect(nameRef.value).toBe('john');

      // Update the ref
      nameRef.value = 'jane';
      await nextTick();

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/?name=jane#/route?name=jane');
    });

    it('should work with hash-params mode', async () => {
      const { queryAdapter } = createHashAdapter({ mode: 'hash-params' });
      mockLocation.hash = '#name=john&age=25';

      const nameRef = useQueryRef('name', {
        defaultValue: '',
        codec: stringCodec,
        queryAdapter,
      });

      expect(nameRef.value).toBe('john');

      // Update the ref
      nameRef.value = 'jane';
      await nextTick();

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        {},
        '',
        '/?name=jane&age=25#name=jane&age=25'
      );
    });

    it('should handle number codec with hash mode', async () => {
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });
      mockLocation.hash = '#/app?page=2';

      const pageRef = useQueryRef('page', {
        defaultValue: 1,
        codec: numberCodec,
        queryAdapter,
      });

      expect(pageRef.value).toBe(2);

      // Update the ref
      pageRef.value = 3;
      await nextTick();

      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/?page=3#/app?page=3');
    });
  });

  describe('useQueryReactive with hash adapter', () => {
    it('should work with hash mode for multiple parameters', async () => {
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });
      mockLocation.hash = '#/search?q=vue&page=1';

      const { queryState } = useQueryReactive(
        {
          q: { defaultValue: '', codec: stringCodec },
          page: { defaultValue: 1, codec: numberCodec },
        },
        { queryAdapter }
      );

      expect(queryState.q).toBe('vue');
      expect(queryState.page).toBe(1);

      // Update multiple parameters
      queryState.q = 'react';
      queryState.page = 2;
      await nextTick();

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        {},
        '',
        '/?q=react&page=2#/search?q=react&page=2'
      );
    });

    it('should work with hash-params mode for multiple parameters', async () => {
      const { queryAdapter } = createHashAdapter({ mode: 'hash-params' });
      mockLocation.hash = '#q=vue&page=1';

      const { queryState } = useQueryReactive(
        {
          q: { defaultValue: '', codec: stringCodec },
          page: { defaultValue: 1, codec: numberCodec },
        },
        { queryAdapter }
      );

      expect(queryState.q).toBe('vue');
      expect(queryState.page).toBe(1);

      // Update multiple parameters
      queryState.q = 'react';
      queryState.page = 2;
      await nextTick();

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        {},
        '',
        '/?q=react&page=2#q=react&page=2'
      );
    });

    it('should handle batch updates with hash adapter', async () => {
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });
      mockLocation.hash = '#/filters?category=tech&sort=date';

      const { queryState, updateBatch } = useQueryReactive(
        {
          category: { defaultValue: '', codec: stringCodec },
          sort: { defaultValue: '', codec: stringCodec },
          page: { defaultValue: 1, codec: numberCodec },
        },
        { queryAdapter }
      );

      expect(queryState.category).toBe('tech');
      expect(queryState.sort).toBe('date');
      expect(queryState.page).toBe(1);

      // Batch update
      updateBatch({
        category: 'science',
        sort: 'popularity',
        page: 3,
      });

      await nextTick();

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        {},
        '',
        '/?category=science&sort=popularity&page=3#/filters?category=science&sort=popularity&page=3'
      );
    });
  });

  describe('two-way synchronization with hash adapter', () => {
    it('should sync external hash changes with hash mode', async () => {
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });
      mockLocation.hash = '#/route?name=initial';

      const nameRef = useQueryRef('name', {
        defaultValue: '',
        codec: stringCodec,
        queryAdapter,
        enableTwoWaySync: true,
      });

      expect(nameRef.value).toBe('initial');

      // Simulate external hash change
      mockLocation.hash = '#/route?name=updated';

      // Get the callback that was registered
      const addEventListenerCalls = mockWindow.addEventListener.mock.calls;
      const hashChangeHandler = addEventListenerCalls.find(
        (call: any) => call[0] === 'hashchange'
      )?.[1];

      if (hashChangeHandler) {
        hashChangeHandler();
        await nextTick();
        expect(nameRef.value).toBe('updated');
      }
    });

    it('should sync external hash changes with hash-params mode', async () => {
      const { queryAdapter } = createHashAdapter({ mode: 'hash-params' });
      mockLocation.hash = '#name=initial';

      const nameRef = useQueryRef('name', {
        defaultValue: '',
        codec: stringCodec,
        queryAdapter,
        enableTwoWaySync: true,
      });

      expect(nameRef.value).toBe('initial');

      // Simulate external hash change
      mockLocation.hash = '#name=updated';

      // Get the callback that was registered
      const addEventListenerCalls = mockWindow.addEventListener.mock.calls;
      const hashChangeHandler = addEventListenerCalls.find(
        (call: any) => call[0] === 'hashchange'
      )?.[1];

      if (hashChangeHandler) {
        hashChangeHandler();
        await nextTick();
        expect(nameRef.value).toBe('updated');
      }
    });
  });

  describe('history strategy with hash adapter', () => {
    it('should use push strategy when specified', async () => {
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });
      mockLocation.hash = '#/route';

      // Reset mocks for this test
      mockHistory.pushState = vi.fn();
      mockHistory.replaceState = vi.fn();

      const nameRef = useQueryRef('name', {
        defaultValue: '',
        codec: stringCodec,
        queryAdapter,
        historyStrategy: 'push',
      });

      nameRef.value = 'test';
      await nextTick();

      expect(mockHistory.pushState).toHaveBeenCalled();
      expect(mockHistory.replaceState).not.toHaveBeenCalled();
    });

    it('should use replace strategy by default', async () => {
      const { queryAdapter } = createHashAdapter({ mode: 'hash' });
      mockLocation.hash = '#/route';

      // Reset mocks for this test
      mockHistory.pushState = vi.fn();
      mockHistory.replaceState = vi.fn();

      const nameRef = useQueryRef('name', {
        defaultValue: '',
        codec: stringCodec,
        queryAdapter,
      });

      nameRef.value = 'test';
      await nextTick();

      expect(mockHistory.replaceState).toHaveBeenCalled();
      expect(mockHistory.pushState).not.toHaveBeenCalled();
    });
  });
});

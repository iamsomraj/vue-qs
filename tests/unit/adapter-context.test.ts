import { describe, it, expect, vi } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { provideQueryAdapter, useQueryAdapter, createVueQsPlugin } from '@/adapter-context';
import type { QueryAdapter } from '@/types';

// Mock query adapter
function createMockQueryAdapter(): QueryAdapter {
  return {
    getCurrentQuery: vi.fn().mockReturnValue({}),
    updateQuery: vi.fn(),
  };
}

describe('adapter-context', () => {
  describe('provideQueryAdapter', () => {
    it('should provide query adapter to component tree', () => {
      const mockAdapter = createMockQueryAdapter();

      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          provideQueryAdapter(mockAdapter);
          return () => null;
        },
      });

      const app = createApp(TestComponent);
      const div = document.createElement('div');

      expect(() => {
        app.mount(div);
        app.unmount();
      }).not.toThrow();
    });
  });

  describe('useQueryAdapter', () => {
    it('should return provided adapter when available', () => {
      const mockAdapter = createMockQueryAdapter();
      let capturedAdapter: QueryAdapter | undefined;

      // Parent component that provides
      const ParentComponent = defineComponent({
        name: 'ParentComponent',
        setup() {
          provideQueryAdapter(mockAdapter);
          return () => h(ChildComponent);
        },
      });

      // Child component that injects
      const ChildComponent = defineComponent({
        name: 'ChildComponent',
        setup() {
          capturedAdapter = useQueryAdapter();
          return () => null;
        },
      });

      const app = createApp(ParentComponent);
      const div = document.createElement('div');
      app.mount(div);

      expect(capturedAdapter).toBe(mockAdapter);
      app.unmount();
    });

    it('should return undefined when no adapter is provided', () => {
      let capturedAdapter: QueryAdapter | undefined;

      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          capturedAdapter = useQueryAdapter();
          return () => null;
        },
      });

      const app = createApp(TestComponent);
      const div = document.createElement('div');
      app.mount(div);

      expect(capturedAdapter).toBeUndefined();
      app.unmount();
    });
  });

  describe('createVueQsPlugin', () => {
    it('should create Vue plugin with query adapter', () => {
      const mockAdapter = createMockQueryAdapter();

      const plugin = createVueQsPlugin({ queryAdapter: mockAdapter });

      expect(plugin).toHaveProperty('install');
      expect(typeof plugin.install).toBe('function');
    });

    it('should install plugin and provide adapter', () => {
      const mockAdapter = createMockQueryAdapter();
      let capturedAdapter: QueryAdapter | undefined;

      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          capturedAdapter = useQueryAdapter();
          return () => null;
        },
      });

      const app = createApp(TestComponent);
      const plugin = createVueQsPlugin({ queryAdapter: mockAdapter });

      app.use(plugin);

      const div = document.createElement('div');
      app.mount(div);

      expect(capturedAdapter).toBe(mockAdapter);
      app.unmount();
    });

    it('should handle plugin installation errors gracefully', () => {
      const mockAdapter = createMockQueryAdapter();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        // Mock implementation to suppress console errors in tests
      });

      const plugin = createVueQsPlugin({ queryAdapter: mockAdapter });

      // Mock app.provide to throw
      const mockApp = {
        provide: vi.fn(() => {
          throw new Error('Provide failed');
        }),
      };

      expect(() => {
        plugin.install(mockApp as any);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[vue-qs]:',
        'Failed to install vue-qs plugin:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should work with multiple apps', () => {
      const mockAdapter1 = createMockQueryAdapter();
      const mockAdapter2 = createMockQueryAdapter();

      let capturedAdapter1: QueryAdapter | undefined;
      let capturedAdapter2: QueryAdapter | undefined;

      const TestComponent1 = defineComponent({
        name: 'TestComponent1',
        setup() {
          capturedAdapter1 = useQueryAdapter();
          return () => null;
        },
      });

      const TestComponent2 = defineComponent({
        name: 'TestComponent2',
        setup() {
          capturedAdapter2 = useQueryAdapter();
          return () => null;
        },
      });

      // First app
      const app1 = createApp(TestComponent1);
      const plugin1 = createVueQsPlugin({ queryAdapter: mockAdapter1 });
      app1.use(plugin1);
      const div1 = document.createElement('div');
      app1.mount(div1);

      // Second app
      const app2 = createApp(TestComponent2);
      const plugin2 = createVueQsPlugin({ queryAdapter: mockAdapter2 });
      app2.use(plugin2);
      const div2 = document.createElement('div');
      app2.mount(div2);

      expect(capturedAdapter1).toBe(mockAdapter1);
      expect(capturedAdapter2).toBe(mockAdapter2);
      expect(capturedAdapter1).not.toBe(capturedAdapter2);

      app1.unmount();
      app2.unmount();
    });
  });

  describe('nested component injection', () => {
    it('should provide adapter to deeply nested components', () => {
      const mockAdapter = createMockQueryAdapter();
      let capturedAdapter: QueryAdapter | undefined;

      const DeepChild = defineComponent({
        name: 'DeepChild',
        setup() {
          capturedAdapter = useQueryAdapter();
          return () => null;
        },
      });

      const MiddleComponent = defineComponent({
        name: 'MiddleComponent',
        setup() {
          return () => h(DeepChild);
        },
      });

      const RootComponent = defineComponent({
        name: 'RootComponent',
        setup() {
          provideQueryAdapter(mockAdapter);
          return () => h(MiddleComponent);
        },
      });

      const app = createApp(RootComponent);
      const div = document.createElement('div');
      app.mount(div);

      expect(capturedAdapter).toBe(mockAdapter);
      app.unmount();
    });

    it('should override parent adapter with closer one', () => {
      const parentAdapter = createMockQueryAdapter();
      const childAdapter = createMockQueryAdapter();
      let capturedAdapter: QueryAdapter | undefined;

      const DeepChild = defineComponent({
        name: 'DeepChild',
        setup() {
          capturedAdapter = useQueryAdapter();
          return () => null;
        },
      });

      const MiddleComponent = defineComponent({
        name: 'MiddleComponent',
        setup() {
          provideQueryAdapter(childAdapter);
          return () => h(DeepChild);
        },
      });

      const RootComponent = defineComponent({
        name: 'RootComponent',
        setup() {
          provideQueryAdapter(parentAdapter);
          return () => h(MiddleComponent);
        },
      });

      const app = createApp(RootComponent);
      const div = document.createElement('div');
      app.mount(div);

      expect(capturedAdapter).toBe(childAdapter);
      expect(capturedAdapter).not.toBe(parentAdapter);
      app.unmount();
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle adapter methods being called', () => {
      const mockAdapter = createMockQueryAdapter();

      let capturedAdapter: QueryAdapter | undefined;

      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          capturedAdapter = useQueryAdapter();

          // Try to use the adapter methods
          if (capturedAdapter) {
            capturedAdapter.getCurrentQuery();
            capturedAdapter.updateQuery({ test: 'value' });
          }

          return () => null;
        },
      });

      const app = createApp(TestComponent);
      const plugin = createVueQsPlugin({ queryAdapter: mockAdapter });
      app.use(plugin);

      const div = document.createElement('div');

      expect(() => {
        app.mount(div);
        app.unmount();
      }).not.toThrow();

      expect(mockAdapter.getCurrentQuery).toHaveBeenCalled();
      expect(mockAdapter.updateQuery).toHaveBeenCalledWith({ test: 'value' });
    });
  });
});

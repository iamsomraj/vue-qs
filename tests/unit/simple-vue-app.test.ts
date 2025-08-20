import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, defineComponent, nextTick } from 'vue';
import { createHistoryAdapter, queryRef } from '@/index'; // Adjust the import path as necessary

describe('Simple Vue App Tests', () => {
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

    // Create test container
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('should create a Vue app with queryRef', async () => {
    const TestComponent = defineComponent({
      setup() {
        const search = queryRef('search', {
          defaultValue: 'default',
        });

        return { search };
      },
      template: '<div data-testid="search">{{ search }}</div>',
    });

    const app = createApp(TestComponent);
    app.mount(container);
    await nextTick();

    const searchElement = container.querySelector('[data-testid="search"]');
    expect(searchElement?.textContent).toBe('default');

    app.unmount();
  });

  it('should update queryRef value', async () => {
    const TestComponent = defineComponent({
      setup() {
        const count = queryRef('count', {
          defaultValue: 0,
          parse: (v) => (v ? parseInt(v, 10) : 0),
          serializeFunction: (v) => String(v),
        });

        const increment = () => {
          count.value += 1;
        };

        return { count, increment };
      },
      template: `
        <div>
          <div data-testid="count">{{ count }}</div>
          <button @click="increment" data-testid="increment">+</button>
        </div>
      `,
    });

    const app = createApp(TestComponent);
    app.mount(container);
    await nextTick();

    // Initial value
    const countElement = container.querySelector('[data-testid="count"]');
    expect(countElement?.textContent).toBe('0');

    // Click increment
    const button = container.querySelector('[data-testid="increment"]') as HTMLButtonElement;
    button.click();
    await nextTick();

    // Updated value
    expect(countElement?.textContent).toBe('1');

    app.unmount();
  });

  it('should work with history adapter', () => {
    const adapter = createHistoryAdapter();

    expect(adapter).toBeDefined();
    expect(typeof adapter.getCurrentQuery).toBe('function');
    expect(typeof adapter.updateQuery).toBe('function');

    // Basic functionality test
    const query = adapter.getCurrentQuery();
    expect(typeof query).toBe('object');
  });
});

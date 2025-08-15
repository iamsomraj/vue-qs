import { describe, it, expect } from 'vitest';
import { createApp, defineComponent } from 'vue';
import { createVueQsPlugin, queryRef } from '@/index';

describe('adapter injection via plugin', () => {
  it('hooks use the injected adapter without passing adapter option', async () => {
    const calls: Array<Record<string, string | undefined>> = [];
    const mockAdapter = {
      getCurrentQuery() {
        return {} as Record<string, string | undefined>;
      },
      updateQuery(next: Record<string, string | undefined>) {
        calls.push({ ...next });
      },
    };

    const Comp = defineComponent({
      name: 'Comp',
      setup() {
        // shouldOmitDefault=false forces an initial URL write which should hit our mock adapter
        const name = queryRef('name', {
          defaultValue: 'John',
          shouldOmitDefault: false,
        });
        // update once to ensure reactive watch also uses the injected adapter
        name.value = 'Jane';
        return {};
      },
      render() {
        return null;
      },
    });

    const el = document.createElement('div');
    const app = createApp(Comp);
    app.use(createVueQsPlugin({ queryAdapter: mockAdapter as any }));
    app.mount(el);

    // Should have at least two calls: initial sync and update to 'Jane'
    expect(calls.length).toBeGreaterThanOrEqual(2);
    // Last call should contain the updated value
    const last = calls[calls.length - 1];
    expect(last.name).toBe('Jane');
  });
});

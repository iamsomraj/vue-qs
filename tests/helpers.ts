import { createApp, defineComponent, h, type App, type Plugin } from 'vue';

/**
 * Runs a composable inside a mounted component and returns its result,
 * with an `unmount` helper.
 */
export function withSetup<T>(
  composable: () => T,
  plugins: Plugin[] = []
): { result: T; app: App; unmount: () => void } {
  let result!: T;
  const app = createApp(
    defineComponent({
      setup() {
        result = composable();
        return () => h('div');
      },
    })
  );
  plugins.forEach((plugin) => app.use(plugin));
  const root = document.createElement('div');
  document.body.appendChild(root);
  app.mount(root);
  return { result, app, unmount: () => app.unmount() };
}

/** Waits for queued microtasks (URL flushes) to run. */
export async function flushPromises(): Promise<void> {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
}

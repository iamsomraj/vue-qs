import { getCurrentInstance, onBeforeUnmount, reactive, watch } from 'vue';
import type {
  ParamOption,
  ParamSchema,
  Parser,
  Serializer,
  UseQueryReactiveOptions,
  UseQueryReactiveReturn,
} from '@/types';
import { string as stringCodec } from '@/serializers';
import { createQuerySync } from '@/querySync';
import { useQueryAdapter } from '@/adapterContext';

const defaultSerialize = stringCodec.serialize as Serializer<any>;
const defaultParse = stringCodec.parse as Parser<any>;

// Lazily-created shared history adapter (same instance reused across hook calls)
let sharedHistoryAdapter: ReturnType<typeof createQuerySync>['adapter'] | undefined;
function getOrCreateSharedHistoryAdapter() {
  if (!sharedHistoryAdapter) sharedHistoryAdapter = createQuerySync().adapter;
  return sharedHistoryAdapter;
}

/**
 * Manage multiple query parameters as a single reactive object.
 * Keeps the URL in sync as any field changes; optionally syncs URL -> state.
 */
export function useQueryReactive<TSchema extends ParamSchema>(
  schema: TSchema,
  options: UseQueryReactiveOptions = {}
): UseQueryReactiveReturn<TSchema> {
  const componentInstance = getCurrentInstance();
  const injectedAdapter = componentInstance ? useQueryAdapter() : undefined;

  const adapter = options.adapter ?? injectedAdapter ?? getOrCreateSharedHistoryAdapter();
  const currentQuerySnapshot = adapter.getQuery();
  const twoWay = options.twoWay === true;

  // Build the reactive object with correctly typed values
  type StateShape = { [K in keyof TSchema]: TSchema[K] extends ParamOption<infer T> ? T : never };
  const state = reactive({} as StateShape);

  // Initialize each field by parsing the existing query (or using the default)
  for (const key in schema) {
    const config = schema[key];
    const parseField: Parser<any> = config.parse ?? config.codec?.parse ?? defaultParse;
    const raw = currentQuerySnapshot[key] ?? null;
    (state as any)[key] = raw != null ? parseField(raw) : config.default;
  }

  // Helper: custom equality fallback to Object.is
  const valuesEqual = (a: any, b: any, eq?: (x: any, y: any) => boolean) =>
    eq ? eq(a, b) : Object.is(a, b);

  // Convert a partial of state -> serialized string entries (omitting defaults when configured)
  function serializeSubset(src: Partial<StateShape>) {
    const out: Record<string, string | undefined> = {};
    for (const key in schema) {
      if (!(key in src)) continue; // only serialize provided keys
      const val = (src as any)[key];
      const config = schema[key];
      const toString: Serializer<any> =
        config.serialize ?? config.codec?.serialize ?? defaultSerialize;
      const isDefault =
        config.default !== undefined && valuesEqual(val, config.default, config.equals);
      const omit = (config.omitIfDefault ?? true) && isDefault;
      out[key] = omit ? undefined : (toString(val) ?? undefined);
    }
    return out;
  }

  // Write the whole current state object to the URL
  function syncAll() {
    const full: Partial<StateShape> = {};
    for (const key in schema) (full as any)[key] = (state as any)[key];
    adapter.setQuery(serializeSubset(full), { history: options.history ?? 'replace' });
  }

  // Watch all fields; whenever any change we diff->serialize->write (except when coming from adapter)
  let syncingFromAdapter = false;
  // Guard to suppress watcher-triggered writes during explicit batch() updates
  let batching = false;
  watch(
    () => {
      const snapshot: Partial<StateShape> = {};
      for (const key in schema) (snapshot as any)[key] = (state as any)[key];
      return snapshot;
    },
    (changed) => {
      if (syncingFromAdapter || batching) return;
      adapter.setQuery(serializeSubset(changed as Partial<StateShape>), {
        history: options.history ?? 'replace',
      });
    },
    { deep: true, flush: 'sync' }
  );

  // Batch: make several state changes then write one combined query update
  function batch(update: Partial<StateShape>, batchOptions?: { history?: 'replace' | 'push' }) {
    batching = true;
    try {
      for (const k in update) (state as any)[k] = (update as any)[k];
      const entries = serializeSubset(update);
      adapter.setQuery(entries, {
        history: batchOptions?.history ?? options.history ?? 'replace',
      });
    } finally {
      queueMicrotask(() => (batching = false));
    }
  }

  // Two-way mode: reflect external navigation (router / back button) into state
  if (twoWay) {
    function applyFromAdapter() {
      const fresh = adapter.getQuery();
      syncingFromAdapter = true;
      try {
        for (const key in schema) {
          const config = schema[key];
          const parseField: Parser<any> = config.parse ?? config.codec?.parse ?? defaultParse;
          const raw = fresh[key] ?? null;
          (state as any)[key] = raw != null ? parseField(raw) : config.default;
        }
      } finally {
        queueMicrotask(() => (syncingFromAdapter = false));
      }
    }

    let unsubscribe: (() => void) | undefined;
    if (adapter.subscribe) {
      unsubscribe = adapter.subscribe(applyFromAdapter);
    } else if (typeof window !== 'undefined') {
      const handler = () => applyFromAdapter();
      window.addEventListener('popstate', handler);
      unsubscribe = () => window.removeEventListener('popstate', handler);
    }
    if (unsubscribe && componentInstance) onBeforeUnmount(unsubscribe);
  }

  return { state: state as StateShape, batch, sync: syncAll };
}

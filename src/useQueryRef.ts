import { getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import type { Parser, Serializer, UseQueryRefOptions, UseQueryRefReturn } from '@/types';
import { string as stringCodec } from '@/serializers';
import { createQuerySync } from '@/querySync';
import { useQueryAdapter } from '@/adapterContext';

const defaultSerialize = stringCodec.serialize as Serializer<any>;
const defaultParse = stringCodec.parse as Parser<any>;

// Lazily create one shared History API adapter (so multiple hooks reuse it)
let sharedHistoryAdapter: ReturnType<typeof createQuerySync>['adapter'] | undefined;
function getOrCreateSharedHistoryAdapter() {
  if (!sharedHistoryAdapter) {
    sharedHistoryAdapter = createQuerySync().adapter;
  }
  return sharedHistoryAdapter;
}

/**
 * Manage a single query parameter as a Vue Ref.
 * Keeps the URL in sync as the ref changes; optionally syncs URL -> state.
 */
export function useQueryRef<T>(
  name: string,
  options: UseQueryRefOptions<T> = {}
): UseQueryRefReturn<T> {
  // Destructure options with clear names for readability
  const {
    default: defaultValue,
    codec,
    parse,
    serialize,
    equals,
    omitIfDefault = true,
    history = 'replace',
    adapter: passedAdapter,
    twoWay = false,
  } = options as UseQueryRefOptions<T> & { codec?: { parse: Parser<T>; serialize: Serializer<T> } };

  // Use provided adapter -> injected adapter -> shared history adapter
  const injectedAdapter = getCurrentInstance() ? useQueryAdapter() : undefined;
  const adapter = passedAdapter ?? injectedAdapter ?? getOrCreateSharedHistoryAdapter();

  // Choose parse / serialize functions (codec wins if given)
  const parseValue: Parser<T> = parse ?? codec?.parse ?? defaultParse;
  const serializeValue: Serializer<T> = serialize ?? codec?.serialize ?? defaultSerialize;

  // Read the current raw string from the URL and parse it or fall back to the default
  const rawInitial = adapter.getQuery()[name] ?? null;
  const initial: T = rawInitial != null ? parseValue(rawInitial) : (defaultValue as T);
  const state = ref<T>(initial) as unknown as UseQueryRefReturn<T>;

  // Equality helper (supports custom deep compare for objects)
  const isEqual = (a: T, b: T) => (equals ? equals(a, b) : Object.is(a, b));

  // Decide if a value is the declared default
  const isDefaultValue = (val: T) => defaultValue !== undefined && isEqual(val, defaultValue as T);

  // Push the current value to the URL (or remove it if default and omitIfDefault=true)
  function writeUrl(val: T) {
    const serialized = serializeValue(val);
    const shouldOmit = omitIfDefault && isDefaultValue(val);
    adapter.setQuery({ [name]: shouldOmit ? undefined : (serialized ?? undefined) }, { history });
  }

  // If there is no existing param but we want defaults kept in the URL, write it now
  if (rawInitial == null && defaultValue !== undefined && !omitIfDefault) {
    writeUrl(defaultValue as T);
  }

  // Guard to avoid infinite loops when we update state from adapter changes
  let syncingFromAdapter = false;

  // Watch the ref and update the URL immediately (flush: 'sync')
  watch(
    state,
    (val) => {
      if (syncingFromAdapter) return; // ignore internal updates
      writeUrl(val as T);
    },
    { flush: 'sync' }
  );

  // Expose manual sync() method for convenience
  state.sync = () => writeUrl(state.value as T);

  // Optional two-way mode: listen for browser/router navigations and re-parse value
  if (twoWay) {
    function applyFromAdapter() {
      const raw = adapter.getQuery()[name] ?? null;
      const next = raw != null ? parseValue(raw) : (defaultValue as T);
      syncingFromAdapter = true;
      try {
        (state as any).value = next;
      } finally {
        // release the guard in next microtask so any watcher runs after this tick
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
    if (unsubscribe && getCurrentInstance()) onBeforeUnmount(unsubscribe);
  }

  return state;
}

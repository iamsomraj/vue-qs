import { getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import type { Parser, Serializer, UseQueryRefOptions, UseQueryRefReturn } from '@/types';
import { string as stringCodec } from '@/serializers';
import { createQuerySync } from '@/querySync';
import { useQueryAdapter } from '@/adapterContext';

const defaultSerialize = stringCodec.serialize as Serializer<any>;
const defaultParse = stringCodec.parse as Parser<any>;

let cachedDefaultAdapter: ReturnType<typeof createQuerySync>['adapter'] | undefined;

function getDefaultAdapter() {
  if (!cachedDefaultAdapter) {
    cachedDefaultAdapter = createQuerySync().adapter;
  }
  return cachedDefaultAdapter;
}

/**
 * Manage a single query parameter as a Vue Ref.
 * Keeps the URL in sync as the ref changes; optionally syncs URL -> state.
 */
export function useQueryRef<T>(
  param: string,
  options: UseQueryRefOptions<T> = {}
): UseQueryRefReturn<T> {
  const {
    default: defVal,
    codec,
    parse,
    serialize,
    equals,
    omitIfDefault = true,
    history = 'replace',
    adapter: customAdapter,
    twoWay = false,
  } = options as any;
  const injected = getCurrentInstance() ? useQueryAdapter() : undefined;
  const adapter = customAdapter ?? injected ?? getDefaultAdapter();

  const initialRaw = adapter.getQuery()[param] ?? null;
  const parseFn: Parser<T> = parse ?? codec?.parse ?? defaultParse;
  const serializeFn: Serializer<T> = serialize ?? codec?.serialize ?? defaultSerialize;

  const initial = initialRaw != null ? parseFn(initialRaw) : (defVal as T);
  const state = ref<T>(initial) as unknown as UseQueryRefReturn<T>;

  const isEqual = (a: T, b: T) => (equals ? equals(a, b) : Object.is(a, b));

  const isDefault = (val: T) => defVal !== undefined && isEqual(val as T, defVal as T);

  const writeToUrl = (val: T) => {
    const s = serializeFn(val as T);
    const shouldOmit = omitIfDefault && isDefault(val as T);
    adapter.setQuery({ [param]: shouldOmit ? undefined : (s ?? undefined) }, { history });
  };

  if (initialRaw == null && defVal !== undefined && !omitIfDefault) {
    writeToUrl(defVal as T);
  }

  let isSyncingFromAdapter = false;
  watch(
    state,
    (val: T) => {
      if (isSyncingFromAdapter) return;
      writeToUrl(val as T);
    },
    { deep: false, flush: 'sync' }
  );

  state.sync = () => {
    writeToUrl(state.value as T);
  };

  if (twoWay) {
    const applyFromAdapter = () => {
      const raw = adapter.getQuery()[param] ?? null;
      const next = raw != null ? parseFn(raw) : (defVal as T);
      isSyncingFromAdapter = true;
      try {
        (state as any).value = next;
      } finally {
        queueMicrotask(() => {
          isSyncingFromAdapter = false;
        });
      }
    };

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

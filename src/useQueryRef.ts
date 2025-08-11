import { getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import type { Parser, Serializer, UseQueryRefOptions, UseQueryRefReturn } from '@/types';
import { string as stringCodec } from '@/serializers';
import { createQuerySync } from '@/querySync';
import { useQueryAdapter } from '@/adapterContext';

const defaultSerialize = stringCodec.serialize as Serializer<any>;
const defaultParse = stringCodec.parse as Parser<any>;

export function useQueryRef<T>(
  param: string,
  options: UseQueryRefOptions<T> = {}
): UseQueryRefReturn<T> {
  const {
    default: defVal,
    parse,
    serialize,
    equals,
    omitIfDefault = true,
    history = 'replace',
    adapter: customAdapter,
    twoWay = false,
  } = options as any;
  const injected = getCurrentInstance() ? useQueryAdapter() : undefined;
  const adapter = customAdapter ?? injected ?? createQuerySync().adapter;

  const initialRaw = adapter.getQuery()[param] ?? null;
  const parseFn: Parser<T> = parse ?? defaultParse;
  const serializeFn: Serializer<T> = serialize ?? defaultSerialize;

  const initial = initialRaw != null ? parseFn(initialRaw) : (defVal as T);
  const state = ref<T>(initial) as unknown as UseQueryRefReturn<T>;

  // Sync initial value (only if missing and default should be present)
  if (initialRaw == null && defVal !== undefined && !omitIfDefault) {
    const s = serializeFn(defVal as T);
    adapter.setQuery({ [param]: s ?? undefined }, { history });
  }

  // Watch for changes and update URL
  let isApplyingPopState = false;
  watch(
    state,
    (val: T) => {
      if (isApplyingPopState) return; // avoid feedback loop when applying popstate

      const s = serializeFn(val as T);
      const eq = (a: T, b: T) => (equals ? equals(a, b) : Object.is(a, b));
      const isDefault = defVal !== undefined && eq(val as T, defVal as T);
      const shouldOmit = omitIfDefault && isDefault;
      adapter.setQuery({ [param]: shouldOmit ? undefined : (s ?? undefined) }, { history });
    },
    { deep: false, flush: 'sync' }
  );

  state.sync = () => {
    const val = state.value as T;
    const s = serializeFn(val);
    const eq = (a: T, b: T) => (equals ? equals(a, b) : Object.is(a, b));
    const isDefault = defVal !== undefined && eq(val as T, defVal as T);
    const shouldOmit = omitIfDefault && isDefault;
    adapter.setQuery({ [param]: shouldOmit ? undefined : (s ?? undefined) }, { history });
  };

  if (twoWay) {
    const applyFromAdapter = () => {
      const raw = adapter.getQuery()[param] ?? null;
      const next = raw != null ? parseFn(raw) : (defVal as T);
      isApplyingPopState = true;
      try {
        (state as any).value = next;
      } finally {
        queueMicrotask(() => {
          isApplyingPopState = false;
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

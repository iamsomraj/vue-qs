import { onBeforeUnmount, ref, watch } from 'vue';
import type { Parser, Serializer, UseQueryRefOptions, UseQueryRefReturn } from '@/types';
import { string as stringCodec } from '@/serializers';
import { createQuerySync } from '@/querySync';

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
    omitIfDefault = true,
    history = 'replace',
    adapter: customAdapter,
    twoWay = false,
  } = options as any;
  const adapter = customAdapter ?? createQuerySync().adapter;

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
      const isDefault = defVal !== undefined && val === (defVal as T);
      const shouldOmit = omitIfDefault && isDefault;
      adapter.setQuery({ [param]: shouldOmit ? undefined : (s ?? undefined) }, { history });
    },
    { deep: false, flush: 'sync' }
  );

  state.sync = () => {
    const val = state.value as T;
    const s = serializeFn(val);
    const isDefault = defVal !== undefined && val === (defVal as T);
    const shouldOmit = omitIfDefault && isDefault;
    adapter.setQuery({ [param]: shouldOmit ? undefined : (s ?? undefined) }, { history });
  };

  if (typeof window !== 'undefined' && twoWay) {
    const onPopState = () => {
      const raw = adapter.getQuery()[param] ?? null;
      const next = raw != null ? parseFn(raw) : (defVal as T);
      isApplyingPopState = true;
      try {
        (state as any).value = next;
      } finally {
        // next microtask to ignore our own watch tick
        queueMicrotask(() => {
          isApplyingPopState = false;
        });
      }
    };
    window.addEventListener('popstate', onPopState);
    onBeforeUnmount(() => {
      window.removeEventListener('popstate', onPopState);
    });
  }

  return state;
}

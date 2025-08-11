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

/**
 * Manage multiple query parameters as a single reactive object.
 * Keeps the URL in sync as any field changes; optionally syncs URL -> state.
 */
export function useQueryReactive<TSchema extends ParamSchema>(
  schema: TSchema,
  options: UseQueryReactiveOptions = {}
): UseQueryReactiveReturn<TSchema> {
  const injected = getCurrentInstance() ? useQueryAdapter() : undefined;
  let cachedDefaultAdapter: ReturnType<typeof createQuerySync>['adapter'] | undefined;

  function getDefaultAdapter() {
    if (!cachedDefaultAdapter) {
      cachedDefaultAdapter = createQuerySync().adapter;
    }
    return cachedDefaultAdapter;
  }

  const adapter = options.adapter ?? injected ?? getDefaultAdapter();
  const current = adapter.getQuery();
  const twoWay = options.twoWay === true;

  type Out = { [K in keyof TSchema]: TSchema[K] extends ParamOption<infer T> ? T : never };

  const state = reactive({} as Out);

  for (const key in schema) {
    const opt = schema[key];
    const parseParam: Parser<any> = opt.parse ?? opt.codec?.parse ?? defaultParse;
    const raw = current[key] ?? null;
    (state as any)[key] = raw != null ? parseParam(raw) : opt.default;
  }

  const isEqual = (a: any, b: any, eq?: (x: any, y: any) => boolean) =>
    eq ? eq(a, b) : Object.is(a, b);

  const serializeAll = (src: Partial<Out>) => {
    const entries: Record<string, string | undefined> = {};
    for (const key in schema) {
      if (!(key in src)) continue;
      const val = (src as any)[key];
      const opt = schema[key];
      const toString: Serializer<any> = opt.serialize ?? opt.codec?.serialize ?? defaultSerialize;
      const defaulted = opt.default !== undefined && isEqual(val, opt.default, opt.equals);
      const omit = (opt.omitIfDefault ?? true) && defaulted;
      entries[key] = omit ? undefined : (toString(val) ?? undefined);
    }
    return entries;
  };

  function syncAll() {
    const obj: Partial<Out> = {};
    for (const key in schema) (obj as any)[key] = (state as any)[key];
    adapter.setQuery(serializeAll(obj), { history: options.history ?? 'replace' });
  }

  let isSyncingFromAdapter = false;
  watch(
    () => {
      const snap: Partial<Out> = {};
      for (const key in schema) (snap as any)[key] = (state as any)[key];
      return snap;
    },
    (val) => {
      if (isSyncingFromAdapter) return;
      adapter.setQuery(serializeAll(val as Partial<Out>), {
        history: options.history ?? 'replace',
      });
    },
    { deep: true, flush: 'sync' }
  );

  function batch(update: Partial<Out>, batchOptions?: { history?: 'replace' | 'push' }) {
    for (const k in update) (state as any)[k] = (update as any)[k];
    const entries = serializeAll(update);
    adapter.setQuery(entries, { history: batchOptions?.history ?? options.history ?? 'replace' });
  }

  if (twoWay) {
    const applyFromAdapter = () => {
      const q = adapter.getQuery();
      isSyncingFromAdapter = true;
      try {
        for (const key in schema) {
          const opt = schema[key];
          const parseParam: Parser<any> = opt.parse ?? opt.codec?.parse ?? defaultParse;
          const raw = q[key] ?? null;
          (state as any)[key] = raw != null ? parseParam(raw) : opt.default;
        }
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

  return { state: state as Out, batch, sync: syncAll };
}

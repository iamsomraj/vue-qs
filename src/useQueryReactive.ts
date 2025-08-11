import { reactive, watch } from 'vue';
import type {
  ParamOption,
  ParamSchema,
  Parser,
  Serializer,
  UseQueryReactiveOptions,
  UseQueryReactiveReturn,
} from './types';
import { string as stringCodec } from './serializers';
import { createQuerySync } from './querySync';

const defaultSerialize = stringCodec.serialize as Serializer<any>;
const defaultParse = stringCodec.parse as Parser<any>;

export function useQueryReactive<TSchema extends ParamSchema>(
  schema: TSchema,
  options: UseQueryReactiveOptions = {}
): UseQueryReactiveReturn<TSchema> {
  const adapter = options.adapter ?? createQuerySync().adapter;
  const current = adapter.getQuery();

  type Out = { [K in keyof TSchema]: TSchema[K] extends ParamOption<infer T> ? T : never };

  const state = reactive({} as Out);

  for (const key in schema) {
    const opt = schema[key];
    const parseFn: Parser<any> = opt.parse ?? defaultParse;
    const raw = current[key] ?? null;
    (state as any)[key] = raw != null ? parseFn(raw) : opt.default;
  }

  function serializeAll(src: Partial<Out>) {
    const entries: Record<string, string | undefined> = {};
    for (const key in schema) {
      if (!(key in src)) continue;
      const val = (src as any)[key];
      const opt = schema[key];
      const serializeFn: Serializer<any> = opt.serialize ?? defaultSerialize;
      const isDefault = opt.default !== undefined && val === opt.default;
      const omit = (opt.omitIfDefault ?? true) && isDefault;
      entries[key] = omit ? undefined : (serializeFn(val) ?? undefined);
    }
    return entries;
  }

  function syncAll() {
    const obj: Partial<Out> = {};
    for (const key in schema) (obj as any)[key] = (state as any)[key];
    adapter.setQuery(serializeAll(obj), { history: options.history ?? 'replace' });
  }

  // Watch individual keys with a single reactive effect
  watch(
    () => {
      const snap: Partial<Out> = {};
      for (const key in schema) (snap as any)[key] = (state as any)[key];
      return snap;
    },
    (val) => {
      const entries = serializeAll(val as Partial<Out>);
      adapter.setQuery(entries, { history: options.history ?? 'replace' });
    },
    { deep: true, flush: 'sync' }
  );

  function batch(update: Partial<Out>, batchOptions?: { history?: 'replace' | 'push' }) {
    for (const k in update) (state as any)[k] = (update as any)[k];
    const entries = serializeAll(update);
    adapter.setQuery(entries, { history: batchOptions?.history ?? options.history ?? 'replace' });
  }

  return { state: state as Out, batch, sync: syncAll };
}

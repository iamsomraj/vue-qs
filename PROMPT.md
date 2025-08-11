# Prompt: Create a Vue Port of nuqs (Type-Safe Search Params State Manager) called vue-qs npm package

## Goal

Port the idea of [nuqs](https://nuqs.47ng.com/) from React to Vue 3, but instead of using React’s `useState` and `useQueryState`, implement equivalents using Vue’s Composition API (`ref` and `reactive`). The library should allow developers to bind query parameters in the URL to reactive state variables, while keeping type safety and serialization/deserialization.

---

## Requirements

1. **Framework**: Vue 3, Composition API
2. **Core API**:
   - `useQueryRef(paramName, options)` → returns a `ref` bound to a URL query parameter.
   - `useQueryReactive(paramSchema)` → returns a `reactive` object bound to multiple query parameters.
3. **Type Safety**:
   - TypeScript-first design.
   - Support generic types for query parameters (`string`, `number`, `boolean`, `Date`, enums, etc.).
4. **Serialization / Parsing**:
   - Encode/decode query params using configurable serializers (default to `string`).
   - Handle optional/default values.
5. **URL Sync**:
   - Auto-update URL on value change (without full reload).
   - Read initial state from current URL.
6. **Vue Router Compatibility**:
   - Work with Vue Router 4 (history mode and hash mode).
7. **SSR Support**:
   - Should work with SSR frameworks like Nuxt 3.
8. **Minimal Dependencies**:
   - No large runtime dependencies.

---

## Example Usage

```ts
import { useQueryRef, useQueryReactive } from 'vue-nuqs';

export default {
  setup() {
    // Single param as ref
    const page = useQueryRef<number>('page', { default: 1, parse: Number });

    // Multiple params as reactive object
    const filters = useQueryReactive({
      search: { default: '', parse: String },
      sort: { default: 'asc' as 'asc' | 'desc', parse: String },
      minPrice: { default: null as number | null, parse: Number },
    });

    return { page, filters };
  },
};
```

---

## Checklist Before Finalizing

- [ ] `useQueryRef` returns a Vue `ref` linked to one query param.
- [ ] `useQueryReactive` returns a Vue `reactive` object linked to multiple query params.
- [ ] Supports generics for strong typing of query params.
- [ ] Automatically updates URL on state change without reload.
- [ ] Works with Vue Router 4.
- [ ] Handles parsing & serialization (customizable per param).
- [ ] Defaults applied if param missing in URL.
- [ ] SSR safe (no window access on server).
- [ ] No unnecessary watchers — performance friendly.
- [ ] Fully written in TypeScript.

---

## Notes

- Think of `useQueryRef` as the `ref` equivalent of `useQueryState` from nuqs.
- Think of `useQueryReactive` as managing a whole query param schema in one object.
- Should not depend on React code; pure Vue implementation.
- Provide type inference for both `ref` and `reactive` versions.
- Optional: Allow batch updates for multiple query params without multiple history entries.

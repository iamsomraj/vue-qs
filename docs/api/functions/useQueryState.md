[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / useQueryState

# Function: useQueryState()

## Call Signature

> **useQueryState**\<`T`, `K`\>(`key`, `parser`): [`QueryStateRef`](../type-aliases/QueryStateRef.md)\<`NonNullable`\<`T`\>\>

Defined in: src/composables/use-query-state.ts:66

Binds a URL query key to a writable ref.

### Type Parameters

#### T

`T`

#### K

`K` *extends* [`ParserType`](../type-aliases/ParserType.md)

### Parameters

#### key

`string`

The query key in the URL

#### parser

[`ParserBuilderWithDefault`](../type-aliases/ParserBuilderWithDefault.md)\<`T`, `K`\>

A parser (e.g. `parseAsInteger.withDefault(1)`), or options for a string state

### Returns

[`QueryStateRef`](../type-aliases/QueryStateRef.md)\<`NonNullable`\<`T`\>\>

### Example

```ts
const q = useQueryState('q')                                        // Ref<string | null>
const page = useQueryState('page', parseAsInteger.withDefault(1))   // Ref<number>

page.value++                                   // ?page=2
await page.set((p) => p + 1, { history: 'push' })
await page.set(null)                           // removes ?page, page.value === 1
```

```vue
<input v-model="q" />
```

## Call Signature

> **useQueryState**\<`T`, `K`\>(`key`, `parser`): [`QueryStateRef`](../type-aliases/QueryStateRef.md)\<`null` \| `T`\>

Defined in: src/composables/use-query-state.ts:70

Binds a URL query key to a writable ref.

### Type Parameters

#### T

`T`

#### K

`K` *extends* [`ParserType`](../type-aliases/ParserType.md)

### Parameters

#### key

`string`

The query key in the URL

#### parser

[`ParserBuilder`](../type-aliases/ParserBuilder.md)\<`T`, `K`\>

A parser (e.g. `parseAsInteger.withDefault(1)`), or options for a string state

### Returns

[`QueryStateRef`](../type-aliases/QueryStateRef.md)\<`null` \| `T`\>

### Example

```ts
const q = useQueryState('q')                                        // Ref<string | null>
const page = useQueryState('page', parseAsInteger.withDefault(1))   // Ref<number>

page.value++                                   // ?page=2
await page.set((p) => p + 1, { history: 'push' })
await page.set(null)                           // removes ?page, page.value === 1
```

```vue
<input v-model="q" />
```

## Call Signature

> **useQueryState**(`key`, `options`): [`QueryStateRef`](../type-aliases/QueryStateRef.md)\<`string`\>

Defined in: src/composables/use-query-state.ts:74

Binds a URL query key to a writable ref.

### Parameters

#### key

`string`

The query key in the URL

#### options

[`Options`](../type-aliases/Options.md) & `object` & `object`

### Returns

[`QueryStateRef`](../type-aliases/QueryStateRef.md)\<`string`\>

### Example

```ts
const q = useQueryState('q')                                        // Ref<string | null>
const page = useQueryState('page', parseAsInteger.withDefault(1))   // Ref<number>

page.value++                                   // ?page=2
await page.set((p) => p + 1, { history: 'push' })
await page.set(null)                           // removes ?page, page.value === 1
```

```vue
<input v-model="q" />
```

## Call Signature

> **useQueryState**(`key`, `options?`): [`QueryStateRef`](../type-aliases/QueryStateRef.md)\<`null` \| `string`\>

Defined in: src/composables/use-query-state.ts:78

Binds a URL query key to a writable ref.

### Parameters

#### key

`string`

The query key in the URL

#### options?

[`UseQueryStateOptions`](../type-aliases/UseQueryStateOptions.md)

### Returns

[`QueryStateRef`](../type-aliases/QueryStateRef.md)\<`null` \| `string`\>

### Example

```ts
const q = useQueryState('q')                                        // Ref<string | null>
const page = useQueryState('page', parseAsInteger.withDefault(1))   // Ref<number>

page.value++                                   // ?page=2
await page.set((p) => p + 1, { history: 'push' })
await page.set(null)                           // removes ?page, page.value === 1
```

```vue
<input v-model="q" />
```

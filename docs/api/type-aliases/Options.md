[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / Options

# Type Alias: Options

> **Options** = `object`

Defined in: src/options.ts:23

Options controlling how state updates are written to the URL.

They can be set on a parser (`parser.withOptions()`), on a composable,
or per call (`state.set(value, options)`).

## Properties

### history?

> `optional` **history**: [`HistoryOptions`](HistoryOptions.md)

Defined in: src/options.ts:25

History mode for URL updates (default: `'replace'`)

***

### scroll?

> `optional` **scroll**: `boolean`

Defined in: src/options.ts:27

Scroll to the top of the page after the URL update (default: `false`)

***

### shallow?

> `optional` **shallow**: `boolean`

Defined in: src/options.ts:32

Update the URL without triggering a full router navigation (default: `true`).
Adapters that cannot update the URL without navigating ignore this option.

***

### ~~throttleMs?~~

> `optional` **throttleMs**: `number`

Defined in: src/options.ts:37

Maximum rate of URL updates, in milliseconds.

#### Deprecated

Use `limitUrlUpdates: throttle(ms)` instead.

***

### limitUrlUpdates?

> `optional` **limitUrlUpdates**: [`LimitUrlUpdates`](LimitUrlUpdates.md)

Defined in: src/options.ts:39

Throttle or debounce URL updates (default: `throttle(50)`)

***

### clearOnDefault?

> `optional` **clearOnDefault**: `boolean`

Defined in: src/options.ts:41

Remove the key from the URL when the value equals the default (default: `true`)

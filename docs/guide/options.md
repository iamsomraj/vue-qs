---
description: 'Control how vue-qs writes to the URL: push or replace history, scroll, clearOnDefault, batching, throttle and debounce.'
---

# Options

Options control how state updates are written to the URL. They match nuqs options.

| Option            | Default        | Description                                                                  |
| ----------------- | -------------- | ---------------------------------------------------------------------------- |
| `history`         | `'replace'`    | `'push'` adds a history entry, so Back restores the previous state           |
| `scroll`          | `false`        | Scroll to the top of the page after the update                               |
| `shallow`         | `true`         | Reserved for adapters that can update the URL without navigating (see below) |
| `clearOnDefault`  | `true`         | Remove the key when the value equals the default                             |
| `limitUrlUpdates` | `throttle(50)` | Throttle or debounce URL updates                                             |
| `throttleMs`      | `50`           | Deprecated alias of `limitUrlUpdates: throttle(ms)`                          |

## Where to set options

Options can be set at four levels. The most specific wins:

1. **Per call**: `state.set(value, options)` or `states.$set(values, options)`
2. **Per parser**: `parser.withOptions(options)`
3. **Per composable**: `useQueryStates(parsers, options)`
4. **App-wide**: `createVueQs({ adapter, defaultOptions })`, for `history`, `scroll`,
   `shallow`, `clearOnDefault` and `limitUrlUpdates` (see
   [Adapters → App-wide settings](./adapters#app-wide-settings))

```ts
const page = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ history: 'push' }));

await page.set(2); // push
await page.set(3, { history: 'replace' }); // replace, for this call only
```

## History

```ts
const tab = useQueryState('tab', parseAsString.withOptions({ history: 'push' }));
```

With `history: 'push'`, each update creates a history entry. The state follows
Back/Forward navigation.

## Scroll

```ts
await page.set(2, { scroll: true }); // scroll to the top once the URL is updated
```

## Clear on default {#clear-on-default}

With the default `clearOnDefault: true`, setting a value equal to the default removes
the key from the URL, keeping URLs short:

```ts
const page = useQueryState('page', parseAsInteger.withDefault(1));
await page.set(1); // URL: no ?page
```

Set it to `false` to always write the value:

```ts
parseAsInteger.withDefault(1).withOptions({ clearOnDefault: false });
```

## Shallow

In nuqs, `shallow: false` asks the framework to re-run server code. In vue-qs:

- The **Vue Router** adapter always navigates through the router (`router.push` /
  `router.replace`), so navigation guards and route watchers run for each URL update.
  `shallow` has no effect.
- The **History** adapter never notifies a router. `shallow` has no effect.

The option is forwarded to [custom adapters](./adapters#custom-adapters), which may use it.

## Batching {#batching}

Updates made in the same tick, from any number of composables, are merged into
**one** URL update:

```ts
lat.value = 48.85;
lng.value = 2.35;
// one history entry, one router navigation: ?lat=48.85&lng=2.35
```

When batched updates use different options, `history: 'push'`, `scroll: true` and
`shallow: false` win.

`set()` returns a promise resolved with the `URLSearchParams` once they are written:

```ts
const search = await page.set(2);
await fetch(`/api/items?${search}`);
```

## Rate limiting

State updates are always instant. Only URL writes are rate-limited, because browsers
limit how often the History API can be called.

### Throttle

URL updates are throttled to one every 50 ms by default. Increase the interval for
fast-changing state:

```ts
import { throttle } from 'vue-qs';

const q = useQueryState('q', parseAsString.withOptions({ limitUrlUpdates: throttle(300) }));
```

### Debounce

Debounce waits until updates stop for the given time. It suits search inputs that
trigger a request on each URL change:

```ts
import { debounce } from 'vue-qs';

const q = useQueryState('q', parseAsString.withDefault(''));

function onInput(value: string) {
  // Clearing the input is applied immediately, typing is debounced
  q.set(value, { limitUrlUpdates: value === '' ? undefined : debounce(500) });
}
```

A non-debounced update on the same key cancels the pending debounced one.

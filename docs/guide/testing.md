---
description: 'Unit-test Vue components that use vue-qs with the in-memory testing adapter.'
---

# Testing

`vue-qs/adapters/testing` provides an in-memory adapter for unit tests. It works with
Vitest, Jest and `@vue/test-utils`.

```ts
import { mount } from '@vue/test-utils';
import { expect, it, vi } from 'vitest';
import { createVueQs } from 'vue-qs';
import { createTestingAdapter } from 'vue-qs/adapters/testing';
import CounterButton from './CounterButton.vue';

it('increments the count', async () => {
  const onUrlUpdate = vi.fn();
  const wrapper = mount(CounterButton, {
    global: {
      plugins: [
        createVueQs({ adapter: createTestingAdapter({ searchParams: '?count=42', onUrlUpdate }) }),
      ],
    },
  });

  await wrapper.get('button').trigger('click');
  await vi.waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());

  const event = onUrlUpdate.mock.calls[0][0];
  expect(event.queryString).toBe('?count=43');
  expect(event.searchParams.get('count')).toBe('43');
});
```

## Options

| Option            | Default | Description                                                         |
| ----------------- | ------- | ------------------------------------------------------------------- |
| `searchParams`    | `''`    | Initial search params: a string, `URLSearchParams` or a record      |
| `onUrlUpdate`     |         | Called with `{ searchParams, queryString, options }` on each update |
| `hasMemory`       | `false` | Store updates, so composables read them back like a real URL        |
| `rateLimitFactor` | `0`     | Throttle multiplier. `0` flushes updates on the next microtask      |

## Simulating navigation

The adapter exposes `setSearchParams` to simulate a URL change made outside vue-qs:

```ts
const adapter = createTestingAdapter({ searchParams: '?q=a' });
// ...mount
adapter.setSearchParams('?q=b');
await nextTick();
```

## Debounced updates

Use fake timers to test debounced updates:

```ts
vi.useFakeTimers();
// ...trigger a debounced update
await vi.advanceTimersByTimeAsync(500);
expect(onUrlUpdate).toHaveBeenCalled();
```

## Testing custom parsers

`vue-qs/testing` provides the same helpers as `nuqs/testing` to check that a parser
round-trips. Each returns `true` or throws with a description of the mismatch:

```ts
import { createParser } from 'vue-qs';
import { isParserBijective, testParseThenSerialize, testSerializeThenParse } from 'vue-qs/testing';

const parseAsStarRating = createParser({
  parse: (value) => value.match(/★/g)?.length ?? null,
  serialize: (value: number) => '★'.repeat(value),
});

it('round-trips', () => {
  // '★★★' parses to 3, and 3 serializes to '★★★'
  expect(isParserBijective(parseAsStarRating, '★★★', 3)).toBe(true);
  expect(testSerializeThenParse(parseAsStarRating, 5)).toBe(true);
  // Throws: '★x★' parses to 2, which serializes to '★★'
  expect(() => testParseThenSerialize(parseAsStarRating, '★x★')).toThrow();
});
```

For parsers reading repeated keys, pass the query as an array of strings
(`isParserBijective(parser, ['1', '2'], [1, 2])`).

---
name: Bug report
about: Report something that does not work as documented
labels: bug
assignees: ''
---

## Description

A clear and concise description of the bug.

## Environment

- vue-qs version: (e.g. 0.2.0)
- Vue version: (e.g. 3.5.0)
- Adapter: (vue-router / history / testing / custom)
- vue-router or Nuxt version (if applicable):
- Build tool: (e.g. Vite, Nuxt)
- Browser / runtime: (e.g. Chrome 130, Node 22)

## Reproduction

A **minimal reproduction** (StackBlitz or a GitHub repository) helps a lot.

1. Go to '...'
2. Click on '...'
3. See error

```ts
// Minimal code, e.g.
const page = useQueryState('page', parseAsInteger.withDefault(1));
```

## Expected behavior

What you expected to happen, including the expected URL.

## Actual behavior

What happened instead, including the actual URL.

## Logs

Run `localStorage.debug = 'vue-qs'`, reload, reproduce, and paste the console output.

```
(paste logs here)
```

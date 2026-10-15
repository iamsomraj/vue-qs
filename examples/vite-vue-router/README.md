# vue-qs playground (Vite + Vue Router)

A small product list whose filters live in the URL:

- `useQueryStates` for search (`?q=`, debounced), sort (`?sort=`) and page (`?page=`)
- `useQueryState` for a tab (`?tab=`) with `history: 'push'`, so Back / Forward move
  between tabs

## Open in StackBlitz

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/iamsomraj/vue-qs/tree/main/examples/vite-vue-router)

## Run locally

```sh
npm install
npm run dev
```

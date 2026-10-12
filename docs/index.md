---
layout: home
title: vue-qs
titleTemplate: 'Type-safe search params state for Vue 3'
description: 'vue-qs is a type-safe search params state manager for Vue 3 and Nuxt, a port of nuqs. Store state in the URL with writable refs, parsers and batched updates.'
hero:
  name: vue-qs
  text: Type-safe search params state for Vue
  tagline: A port of nuqs for Vue 3. Store state in the URL with writable refs, parsers and batched updates.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Migrating from 0.1.x
      link: /guide/migration
    - theme: alt
      text: API
      link: /api/
features:
  - title: The nuqs API, for Vue
    details: The same parsers, options and behaviour as nuqs, exposed as writable refs and reactive objects that work with v-model.
  - title: Type-safe parsers
    details: Integers, floats, booleans, dates, literals, enums, arrays, repeated keys and validated JSON (Zod, Valibot, ArkType), plus your own.
  - title: Batched and rate-limited
    details: Updates in the same tick become one URL update. Throttle or debounce URL writes while state stays instant.
  - title: Vue Router, Nuxt and SSR
    details: Adapters for Vue Router (and Nuxt), the History API and tests. Server loaders and serializers share the same parsers.
---

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <header>
    <h1>vue-qs playground</h1>
    <p class="url">
      URL: <code>{{ route.fullPath }}</code>
    </p>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style>
body {
  font-family: system-ui, sans-serif;
  max-width: 640px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.url code {
  background: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}
</style>

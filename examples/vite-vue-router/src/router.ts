import { createRouter, createWebHistory } from 'vue-router';
import ProductsView from './ProductsView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: ProductsView }],
});

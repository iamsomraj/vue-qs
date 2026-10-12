import { afterEach, beforeEach } from 'vitest';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  document.body.innerHTML = '';
});

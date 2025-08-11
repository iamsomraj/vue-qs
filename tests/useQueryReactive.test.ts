import { describe, it, expect } from 'vitest';
import { useQueryReactive } from '../src/useQueryReactive';

describe('useQueryReactive', () => {
  it('initializes from defaults and batches updates', () => {
    const { state, batch } = useQueryReactive({
      search: { default: '', parse: String },
      sort: { default: 'asc' as 'asc' | 'desc', parse: String },
    });

    expect(state.search).toBe('');
    expect(state.sort).toBe('asc');

    batch({ search: 'abc', sort: 'desc' }, { history: 'replace' });

    const url = new URL(window.location.href);
    expect(url.searchParams.get('search')).toBe('abc');
    expect(url.searchParams.get('sort')).toBe('desc');
  });
});

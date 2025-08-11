import { describe, it, expect } from 'vitest';
import { useQueryRef } from '../src/useQueryRef';

// happy-dom environment provides window

describe('useQueryRef', () => {
  it('reads default when missing and writes when sync called', () => {
    const page = useQueryRef<number>('page', { default: 1, parse: Number, omitIfDefault: false });
    expect(page.value).toBe(1);
    page.sync();
    expect(new URL(window.location.href).searchParams.get('page')).toBe('1');
  });

  it('updates URL on change', () => {
    const page = useQueryRef<number>('page2', { default: 1, parse: Number });
    page.value = 5;
    expect(new URL(window.location.href).searchParams.get('page2')).toBe('5');
  });
});

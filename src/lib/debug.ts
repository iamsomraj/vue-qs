function isDebugEnabled(): boolean {
  try {
    return (
      typeof localStorage !== 'undefined' &&
      (localStorage.getItem('debug') ?? '').includes('vue-qs')
    );
  } catch {
    return false;
  }
}

/**
 * Logs internal events when `localStorage.debug` contains `vue-qs`.
 * @internal
 */
export function debug(message: string, ...args: unknown[]): void {
  if (!isDebugEnabled()) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log(`[vue-qs] ${message}`, ...args);
}

/**
 * Logs a warning with the vue-qs prefix.
 * @internal
 */
export function warn(message: string, ...args: unknown[]): void {
  console.warn(`[vue-qs] ${message}`, ...args);
}

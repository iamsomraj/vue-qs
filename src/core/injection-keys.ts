/**
 * Unique symbol used for dependency injection of the query adapter
 * Prevents naming collisions with other injected dependencies
 */
export const QUERY_ADAPTER_INJECTION_KEY = Symbol.for('vue-qs:query-adapter');

/**
 * Type for the injection key to ensure type safety
 */
export type QueryAdapterInjectionKey = typeof QUERY_ADAPTER_INJECTION_KEY;

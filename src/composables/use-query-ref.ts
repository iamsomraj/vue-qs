import { getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import { useQueryAdapter } from '@/adapterContext';
import { createHistoryAdapter } from '@/adapters/history-adapter';
import { stringCodec } from '@/serializers';
import type {
  QueryParser,
  QuerySerializer,
  UseQueryRefOptions,
  QueryRefReturn,
  QueryAdapter,
  QueryCodec,
} from '@/types';
import { areValuesEqual } from '@/utils/core-helpers';

// Shared history adapter instance for performance optimization
let sharedHistoryAdapterInstance:
  | ReturnType<typeof createHistoryAdapter>['queryAdapter']
  | undefined;

/**
 * Gets or creates the shared history adapter instance
 * This optimization ensures multiple useQueryRef calls share the same adapter
 */
function getSharedHistoryAdapter(): ReturnType<typeof createHistoryAdapter>['queryAdapter'] {
  if (!sharedHistoryAdapterInstance) {
    const { queryAdapter } = createHistoryAdapter();
    sharedHistoryAdapterInstance = queryAdapter;
  }
  return sharedHistoryAdapterInstance;
}

/**
 * Helper function to select the appropriate query adapter
 */
function selectQueryAdapter(providedAdapter?: QueryAdapter): QueryAdapter {
  if (providedAdapter !== undefined) {
    return providedAdapter;
  }

  const componentInstance = getCurrentInstance();
  const injectedAdapter = componentInstance !== null ? useQueryAdapter() : undefined;

  return injectedAdapter ?? getSharedHistoryAdapter();
}

/**
 * Helper function to get parser and serializer functions
 */
function getCodecFunctions<T>(
  parseFunction?: QueryParser<T>,
  serializeFunction?: QuerySerializer<T>,
  codec?: QueryCodec<T>
): { parseValue: QueryParser<T>; serializeValue: QuerySerializer<T> } {
  return {
    parseValue: parseFunction ?? codec?.parse ?? (stringCodec.parse as QueryParser<T>),
    serializeValue:
      serializeFunction ?? codec?.serialize ?? (stringCodec.serialize as QuerySerializer<T>),
  };
}

/**
 * Manages a single query parameter as a Vue Ref with URL synchronization
 *
 * @template T The type of the parameter value
 * @param parameterName The name of the URL query parameter
 * @param options Configuration options for the parameter
 * @returns Reactive ref that stays in sync with the URL parameter
 *
 * @example
 * ```typescript
 * import { useQueryRef, numberCodec } from 'vue-qs';
 *
 * // Simple string parameter with default
 * const searchQuery = useQueryRef('q', {
 *   defaultValue: '',
 *   enableTwoWaySync: true
 * });
 *
 * // Number parameter with custom codec
 * const currentPage = useQueryRef('page', {
 *   defaultValue: 1,
 *   codec: numberCodec,
 *   shouldOmitDefault: true
 * });
 *
 * // Update the URL by changing the ref value
 * searchQuery.value = 'hello world';
 * currentPage.value = 2;
 *
 * // Manually sync to URL
 * searchQuery.syncToUrl();
 * ```
 */
export function useQueryRef<T>(
  parameterName: string,
  options: UseQueryRefOptions<T> = {}
): QueryRefReturn<T> {
  // Extract and provide defaults for options
  const {
    defaultValue,
    codec,
    parseFunction,
    serializeFunction,
    isEqual: customEquals,
    shouldOmitDefault = true,
    historyStrategy = 'replace',
    queryAdapter: providedAdapter,
    enableTwoWaySync = false,
  } = options;

  // Determine which adapter to use and get codec functions
  const selectedAdapter = selectQueryAdapter(providedAdapter);
  const { parseValue, serializeValue } = getCodecFunctions(parseFunction, serializeFunction, codec);

  // Read initial value from URL and parse it
  function getInitialValue(): T {
    try {
      const currentQuery = selectedAdapter.getCurrentQuery();
      const rawValue = currentQuery[parameterName] ?? null;

      if (typeof rawValue === 'string' && rawValue.length > 0) {
        return parseValue(rawValue);
      }

      return defaultValue as T;
    } catch (error) {
      console.warn(`Error getting initial value for parameter "${parameterName}":`, error);
      return defaultValue as T;
    }
  }

  const initialValue = getInitialValue();
  const internalRef = ref<T>(initialValue);
  const queryRef = internalRef as unknown as QueryRefReturn<T>;

  // Helper function to check if a value equals the default
  function isDefaultValue(value: T): boolean {
    if (defaultValue === undefined) {
      return false;
    }
    return areValuesEqual(value, defaultValue as T, customEquals);
  }

  // Function to update the URL with the current value
  function updateURL(value: T): void {
    try {
      const serializedValue = serializeValue(value);
      const shouldOmit = shouldOmitDefault && isDefaultValue(value);

      const queryUpdate = {
        [parameterName]: shouldOmit ? undefined : (serializedValue ?? undefined),
      };

      selectedAdapter.updateQuery(queryUpdate, { historyStrategy });
    } catch (error) {
      console.warn(`Error updating URL for parameter "${parameterName}":`, error);
    }
  }

  // Set initial URL value if needed (when default exists but not in URL)
  if (defaultValue !== undefined && !shouldOmitDefault) {
    const currentQuery = selectedAdapter.getCurrentQuery();
    if (!(parameterName in currentQuery)) {
      updateURL(defaultValue as T);
    }
  }

  // Flag to prevent infinite loops during two-way sync
  let isSyncingFromURL = false;

  // Watch for ref changes and sync to URL
  const stopWatcher = watch(
    queryRef,
    (newValue) => {
      if (isSyncingFromURL) {
        return; // Skip URL updates during two-way sync
      }
      updateURL(newValue);
    },
    { flush: 'sync' } // Sync immediately to avoid batching delays
  );

  // Add manual sync method to the ref
  queryRef.syncToUrl = () => {
    updateURL(queryRef.value);
  };

  // Set up two-way synchronization if enabled
  let unsubscribeFromURLChanges: (() => void) | undefined;

  if (enableTwoWaySync) {
    function syncFromURL(): void {
      try {
        const currentQuery = selectedAdapter.getCurrentQuery();
        const rawValue = currentQuery[parameterName] ?? null;
        const parsedValue =
          typeof rawValue === 'string' && rawValue.length > 0
            ? parseValue(rawValue)
            : (defaultValue as T);

        isSyncingFromURL = true;
        try {
          internalRef.value = parsedValue;
        } finally {
          // Reset sync flag in next microtask to ensure watchers run after this update
          queueMicrotask(() => {
            isSyncingFromURL = false;
          });
        }
      } catch (error) {
        console.warn(`Error syncing from URL for parameter "${parameterName}":`, error);
      }
    }

    // Subscribe to URL changes if adapter supports it
    if (selectedAdapter.onQueryChange) {
      unsubscribeFromURLChanges = selectedAdapter.onQueryChange(syncFromURL);
    } else if (typeof window !== 'undefined') {
      // Fallback to popstate for basic browser navigation
      const handlePopState = (): void => syncFromURL();
      window.addEventListener('popstate', handlePopState);
      unsubscribeFromURLChanges = () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }

  // Clean up subscriptions when component unmounts
  const componentInstance = getCurrentInstance();
  if (componentInstance !== null) {
    onBeforeUnmount(() => {
      try {
        stopWatcher();
        unsubscribeFromURLChanges?.();
      } catch (error) {
        console.warn('Error during useQueryRef cleanup:', error);
      }
    });
  }

  return queryRef;
}

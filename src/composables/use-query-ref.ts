import { getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import { useQueryAdapter } from '@/adapter-context';
import { createHistoryAdapter } from '@/adapters/history-adapter';
import { stringCodec } from '@/serializers';
import type {
  QueryParser,
  QuerySerializer,
  QueryRefOptions,
  QueryRefReturn,
  QueryAdapter,
  QueryCodec,
} from '@/types';
import {
  areValuesEqual,
  warn,
  useEventListener,
  createRuntimeEnvironment,
} from '@/utils/core-helpers';

// Shared history adapter instance for performance optimization
let sharedHistoryAdapterInstance: QueryAdapter | undefined;

/**
 * Gets or creates the shared history adapter instance
 * This optimization ensures multiple queryRef calls share the same adapter
 */
function getSharedHistoryAdapter(): QueryAdapter {
  sharedHistoryAdapterInstance ??= createHistoryAdapter();
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
  parse?: QueryParser<T>,
  serializeFunction?: QuerySerializer<T>,
  codec?: QueryCodec<T>
): { parseValue: QueryParser<T>; serializeValue: QuerySerializer<T> } {
  return {
    parseValue: parse ?? codec?.parse ?? (stringCodec.parse as QueryParser<T>),
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
 * import { queryRef, numberCodec } from 'vue-qs';
 *
 * // Simple string parameter with default
 * const searchQuery = queryRef('q', {
 *   defaultValue: ''
 * });
 *
 * // Number parameter with custom codec
 * const currentPage = queryRef('page', {
 *   defaultValue: 1,
 *   codec: numberCodec,
 *   shouldOmitDefault: true
 * });
 *
 * // Update the URL by changing the ref value
 * searchQuery.value = 'hello world';
 * currentPage.value = 2;
 * ```
 */
export function queryRef<T>(
  parameterName: string,
  options: QueryRefOptions<T> = {}
): QueryRefReturn<T> {
  // Extract and provide defaults for options
  const {
    defaultValue,
    codec,
    parse,
    serializeFunction,
    isEqual: customEquals,
    shouldOmitDefault = true,
    historyStrategy = 'replace',
    queryAdapter: providedAdapter,
  } = options;

  // Determine which adapter to use and get codec functions
  const selectedAdapter = selectQueryAdapter(providedAdapter);
  const { parseValue, serializeValue } = getCodecFunctions(parse, serializeFunction, codec);

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
      warn(`Error getting initial value for parameter "${parameterName}":`, error);
      return defaultValue as T;
    }
  }

  const initialValue = getInitialValue();
  const internalRef = ref<T>(initialValue);

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
      // Skip if adapter is currently updating to prevent infinite loops
      const isUpdating = selectedAdapter.isUpdating?.();
      if (isUpdating === true) {
        return;
      }

      const serializedValue = serializeValue(value);
      const shouldOmit = shouldOmitDefault && isDefaultValue(value);

      const queryUpdate = {
        [parameterName]: shouldOmit ? undefined : (serializedValue ?? undefined),
      };

      selectedAdapter.updateQuery(queryUpdate, { historyStrategy });
    } catch (error) {
      warn(`Error updating URL for parameter "${parameterName}":`, error);
    }
  }

  // Function to read from URL and update ref
  function readFromURL(): void {
    try {
      const currentQuery = selectedAdapter.getCurrentQuery();
      const rawValue = currentQuery[parameterName] ?? null;

      let newValue: T;
      if (typeof rawValue === 'string' && rawValue.length > 0) {
        newValue = parseValue(rawValue);
      } else {
        newValue = defaultValue as T;
      }

      // Only update if value actually changed
      if (!areValuesEqual(internalRef.value, newValue, customEquals)) {
        internalRef.value = newValue;
      }
    } catch (error) {
      warn(`Error reading from URL for parameter "${parameterName}":`, error);
    }
  }

  // Set initial URL value if needed (when default exists but not in URL)
  if (defaultValue !== undefined && !shouldOmitDefault) {
    const currentQuery = selectedAdapter.getCurrentQuery();
    if (!(parameterName in currentQuery)) {
      updateURL(defaultValue as T);
    }
  }

  // Watch for ref changes and sync to URL
  const stopWatcher = watch(
    internalRef,
    (newValue) => {
      updateURL(newValue);
    },
    { flush: 'sync' }
  );

  const runtimeEnvironment = createRuntimeEnvironment();
  let removePopstateListener: (() => void) | undefined;
  let removeHashchangeListener: (() => void) | undefined;

  if (runtimeEnvironment.isBrowser && runtimeEnvironment.windowObject) {
    const windowObject = runtimeEnvironment.windowObject;

    removePopstateListener = useEventListener(
      windowObject,
      'popstate',
      () => {
        readFromURL();
      },
      { passive: true }
    );

    // Listen for hashchange (hash-based routing)
    removeHashchangeListener = useEventListener(
      windowObject,
      'hashchange',
      () => {
        readFromURL();
      },
      { passive: true }
    );
  }

  // Clean up subscriptions when component unmounts
  const componentInstance = getCurrentInstance();
  if (componentInstance !== null) {
    onBeforeUnmount(() => {
      try {
        stopWatcher();
        removePopstateListener?.();
        removeHashchangeListener?.();
      } catch (error) {
        warn('Error during queryRef cleanup:', error);
      }
    });
  }

  return internalRef as QueryRefReturn<T>;
}

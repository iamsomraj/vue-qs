import { getCurrentInstance, onBeforeUnmount, reactive, watch } from 'vue';
import { useQueryAdapter } from '@/adapter-context';
import { createHistoryAdapter } from '@/adapters/history-adapter';
import { stringCodec } from '@/serializers';
import type {
  QueryAdapter,
  QueryParameterSchema,
  QueryParser,
  QueryReactiveReturn,
  QuerySerializer,
  ReactiveQueryState,
  QueryReactiveOptions,
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
 */
function getSharedHistoryAdapter(): QueryAdapter {
  sharedHistoryAdapterInstance ??= createHistoryAdapter();
  return sharedHistoryAdapterInstance;
}

/**
 * Manages multiple query parameters as a single reactive object with URL synchronization
 *
 * @template TSchema The schema type defining all parameters
 * @param parameterSchema Schema defining configuration for each parameter
 * @param options Global options for the reactive query state
 * @returns Reactive state object that stays in sync with the URL
 *
 * @example
 * ```typescript
 * import { queryReactive, numberCodec, booleanCodec } from 'vue-qs';
 *
 * const querySchema = {
 *   search: {
 *     defaultValue: '',
 *     shouldOmitDefault: true
 *   },
 *   page: {
 *     defaultValue: 1,
 *     codec: numberCodec
 *   },
 *   showDetails: {
 *     defaultValue: false,
 *     codec: booleanCodec
 *   },
 * } as const;
 *
 * const queryState = queryReactive(querySchema, {
 *   historyStrategy: 'replace'
 * });
 *
 * // Access reactive values
 * console.log(queryState.search, queryState.page, queryState.showDetails);
 *
 * // Update values
 * queryState.search = 'hello';
 * queryState.page = 2;
 * ```
 */
export function queryReactive<TSchema extends QueryParameterSchema>(
  parameterSchema: TSchema,
  options: QueryReactiveOptions = {}
): QueryReactiveReturn<TSchema> {
  // Extract options with defaults
  const { historyStrategy = 'replace', queryAdapter: providedAdapter } = options;

  // Determine which adapter to use
  const componentInstance = getCurrentInstance();
  const injectedAdapter = componentInstance ? useQueryAdapter() : undefined;
  const selectedAdapter = providedAdapter ?? injectedAdapter ?? getSharedHistoryAdapter();

  // Get current query state from URL
  const currentURLQuery = selectedAdapter.getCurrentQuery();

  // Initialize reactive state from schema and URL
  type StateType = ReactiveQueryState<TSchema>;
  const reactiveState = reactive({} as StateType);

  // Initialize each parameter in the state
  Object.keys(parameterSchema).forEach((paramKey) => {
    const paramConfig = parameterSchema[paramKey];

    try {
      // Determine parser function
      const parseValue: QueryParser<any> =
        paramConfig.parse ?? paramConfig.codec?.parse ?? (stringCodec.parse as QueryParser<any>);

      // Get raw value from URL
      const rawValue = currentURLQuery[paramKey] ?? null;

      // Parse value or use default
      const initialValue =
        typeof rawValue === 'string' && rawValue.length > 0
          ? parseValue(rawValue)
          : paramConfig.defaultValue;

      (reactiveState as any)[paramKey] = initialValue;
    } catch (error) {
      warn(`Error initializing parameter "${paramKey}":`, error);
      (reactiveState as any)[paramKey] = paramConfig.defaultValue;
    }
  });

  /**
   * Serializes a subset of state parameters to URL query format
   */
  function serializeStateSubset(
    stateSubset: Partial<StateType>
  ): Record<string, string | undefined> {
    const serializedQuery: Record<string, string | undefined> = {};

    Object.keys(stateSubset).forEach((paramKey) => {
      if (!(paramKey in parameterSchema)) {
        return; // Skip unknown parameters
      }

      try {
        const paramValue = (stateSubset as any)[paramKey];
        const paramConfig = parameterSchema[paramKey];

        // Determine serializer function
        const serializeValue: QuerySerializer<any> =
          paramConfig.serializeFunction ??
          paramConfig.codec?.serialize ??
          (stringCodec.serialize as QuerySerializer<any>);

        // Check if value equals default
        const isDefaultValue =
          paramConfig.defaultValue !== undefined &&
          areValuesEqual(paramValue, paramConfig.defaultValue, paramConfig.isEqual);

        const shouldOmit = (paramConfig.shouldOmitDefault ?? true) && isDefaultValue;

        if (shouldOmit) {
          serializedQuery[paramKey] = undefined;
        } else {
          const serialized = serializeValue(paramValue);
          serializedQuery[paramKey] = serialized ?? undefined;
        }
      } catch (error) {
        warn(`Error serializing parameter "${paramKey}":`, error);
        serializedQuery[paramKey] = undefined;
      }
    });

    return serializedQuery;
  }

  /**
   * Updates the URL with current state values
   */
  function updateURL(): void {
    try {
      // Skip if adapter is currently updating to prevent infinite loops
      const isUpdating = selectedAdapter.isUpdating?.();
      if (isUpdating === true) {
        return;
      }

      const serializedQuery = serializeStateSubset(reactiveState as any);
      selectedAdapter.updateQuery(serializedQuery, { historyStrategy });
    } catch (error) {
      warn('Error syncing state changes to URL:', error);
    }
  }

  /**
   * Reads from URL and updates reactive state
   */
  function readFromURL(): void {
    try {
      const currentURLQuery = selectedAdapter.getCurrentQuery();

      Object.keys(parameterSchema).forEach((paramKey) => {
        const paramConfig = parameterSchema[paramKey];
        const parseValue: QueryParser<any> =
          paramConfig.parse ?? paramConfig.codec?.parse ?? (stringCodec.parse as QueryParser<any>);

        const rawValue = currentURLQuery[paramKey] ?? null;
        let newValue: any;

        if (typeof rawValue === 'string' && rawValue.length > 0) {
          newValue = parseValue(rawValue);
        } else {
          newValue = paramConfig.defaultValue;
        }

        // Only update if value actually changed
        const currentValue = (reactiveState as any)[paramKey];
        if (!areValuesEqual(currentValue, newValue, paramConfig.isEqual)) {
          (reactiveState as any)[paramKey] = newValue;
        }
      });
    } catch (error) {
      warn('Error reading from URL:', error);
    }
  }

  // Watch for state changes and sync to URL
  const stopWatcher = watch(
    () => {
      // Create a snapshot of current state for watching
      const stateSnapshot: Partial<StateType> = {};
      Object.keys(parameterSchema).forEach((key) => {
        (stateSnapshot as any)[key] = (reactiveState as any)[key];
      });
      return stateSnapshot;
    },
    () => {
      updateURL();
    },
    {
      deep: true,
      flush: 'sync', // Immediate updates
    }
  );

  // Listen for browser navigation events
  const runtimeEnvironment = createRuntimeEnvironment();
  let removePopstateListener: (() => void) | undefined;
  let removeHashchangeListener: (() => void) | undefined;

  if (runtimeEnvironment.isBrowser && runtimeEnvironment.windowObject) {
    const windowObject = runtimeEnvironment.windowObject;

    // Listen for popstate (browser back/forward)
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

  if (componentInstance) {
    onBeforeUnmount(() => {
      try {
        stopWatcher();
        removePopstateListener?.();
        removeHashchangeListener?.();
      } catch (error) {
        warn('Error during queryReactive cleanup:', error);
      }
    });
  }

  return reactiveState as StateType;
}

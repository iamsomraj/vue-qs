**vue-qs v0.2.0**

***

# vue-qs v0.2.0

vue-qs - Type-safe search params state manager for Vue, a port of nuqs.

## Example

```ts
import { useQueryState, parseAsInteger } from 'vue-qs'

const page = useQueryState('page', parseAsInteger.withDefault(1))
page.value++ // ?page=2
```

## Interfaces

- [StandardSchemaV1](interfaces/StandardSchemaV1.md)

## Type Aliases

- [VueQsPluginOptions](type-aliases/VueQsPluginOptions.md)
- [UpdateUrlOptions](type-aliases/UpdateUrlOptions.md)
- [QueryAdapter](type-aliases/QueryAdapter.md)
- [SetQueryStateValue](type-aliases/SetQueryStateValue.md)
- [QueryStateRef](type-aliases/QueryStateRef.md)
- [UseQueryStateOptions](type-aliases/UseQueryStateOptions.md)
- [UseQueryStatesOptions](type-aliases/UseQueryStatesOptions.md)
- [SetQueryStatesValue](type-aliases/SetQueryStatesValue.md)
- [QueryStates](type-aliases/QueryStates.md)
- [QueryRecord](type-aliases/QueryRecord.md)
- [LoaderInput](type-aliases/LoaderInput.md)
- [CreateLoaderOptions](type-aliases/CreateLoaderOptions.md)
- [LoaderOptions](type-aliases/LoaderOptions.md)
- [Loader](type-aliases/Loader.md)
- [HistoryOptions](type-aliases/HistoryOptions.md)
- [LimitUrlUpdates](type-aliases/LimitUrlUpdates.md)
- [Options](type-aliases/Options.md)
- [ParserType](type-aliases/ParserType.md)
- [ParserInput](type-aliases/ParserInput.md)
- [ParserOutput](type-aliases/ParserOutput.md)
- [Parser](type-aliases/Parser.md)
- [ParserBuilder](type-aliases/ParserBuilder.md)
- [ParserBuilderWithDefault](type-aliases/ParserBuilderWithDefault.md)
- [AnyParserBuilder](type-aliases/AnyParserBuilder.md)
- [inferParserType](type-aliases/inferParserType.md)
- [ParserDefinition](type-aliases/ParserDefinition.md)
- [JsonValidator](type-aliases/JsonValidator.md)
- [CreateSerializerOptions](type-aliases/CreateSerializerOptions.md)
- [SerializerBase](type-aliases/SerializerBase.md)
- [Serializer](type-aliases/Serializer.md)
- [StandardSchemaV1Result](type-aliases/StandardSchemaV1Result.md)
- [CreateStandardSchemaV1Options](type-aliases/CreateStandardSchemaV1Options.md)
- [Nullable](type-aliases/Nullable.md)
- [UrlKeys](type-aliases/UrlKeys.md)
- [ParserMap](type-aliases/ParserMap.md)
- [Values](type-aliases/Values.md)
- [QueryValue](type-aliases/QueryValue.md)

## Variables

- [QUERY\_ADAPTER\_KEY](variables/QUERY_ADAPTER_KEY.md)
- [VueQsAdapter](variables/VueQsAdapter.md)
- [defaultRateLimit](variables/defaultRateLimit.md)
- [parseAsString](variables/parseAsString.md)
- [parseAsInteger](variables/parseAsInteger.md)
- [parseAsIndex](variables/parseAsIndex.md)
- [parseAsHex](variables/parseAsHex.md)
- [parseAsFloat](variables/parseAsFloat.md)
- [parseAsBoolean](variables/parseAsBoolean.md)
- [parseAsTimestamp](variables/parseAsTimestamp.md)
- [parseAsIsoDateTime](variables/parseAsIsoDateTime.md)
- [parseAsIsoDate](variables/parseAsIsoDate.md)

## Functions

- [createVueQs](functions/createVueQs.md)
- [provideQueryAdapter](functions/provideQueryAdapter.md)
- [useQueryAdapter](functions/useQueryAdapter.md)
- [createAdapter](functions/createAdapter.md)
- [useQueryState](functions/useQueryState.md)
- [useQueryStates](functions/useQueryStates.md)
- [createLoader](functions/createLoader.md)
- [throttle](functions/throttle.md)
- [debounce](functions/debounce.md)
- [createParser](functions/createParser.md)
- [createMultiParser](functions/createMultiParser.md)
- [parseAsStringEnum](functions/parseAsStringEnum.md)
- [parseAsStringLiteral](functions/parseAsStringLiteral.md)
- [parseAsNumberLiteral](functions/parseAsNumberLiteral.md)
- [parseAsJson](functions/parseAsJson.md)
- [parseAsArrayOf](functions/parseAsArrayOf.md)
- [parseAsNativeArrayOf](functions/parseAsNativeArrayOf.md)
- [createSerializer](functions/createSerializer.md)
- [createStandardSchemaV1](functions/createStandardSchemaV1.md)

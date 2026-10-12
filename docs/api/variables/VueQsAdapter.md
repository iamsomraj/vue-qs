[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / VueQsAdapter

# Variable: VueQsAdapter

> `const` **VueQsAdapter**: `DefineComponent`\<`ExtractPropTypes`\<\{ `adapter`: \{ `type`: `PropType`\<[`QueryAdapter`](../type-aliases/QueryAdapter.md)\>; `required`: `true`; \}; \}\>, () => `undefined` \| `VNode`\<`RendererNode`, `RendererElement`, \{\[`key`: `string`\]: `any`; \}\>[], \{ \}, \{ \}, \{ \}, `ComponentOptionsMixin`, `ComponentOptionsMixin`, \{ \}, `string`, `PublicProps`, `ToResolvedProps`\<`ExtractPropTypes`\<\{ `adapter`: \{ `type`: `PropType`\<[`QueryAdapter`](../type-aliases/QueryAdapter.md)\>; `required`: `true`; \}; \}\>, \{ \}\>, \{ \}, \{ \}, \{ \}, \{ \}, `string`, `ComponentProvideOptions`, `true`, \{ \}, `any`\>

Defined in: [src/adapters/context.ts:78](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/adapters/context.ts#L78)

Provides an adapter to its default slot, as an alternative to the plugin.

## Example

```vue
<VueQsAdapter :adapter="adapter">
  <App />
</VueQsAdapter>
```

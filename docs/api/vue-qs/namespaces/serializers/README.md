[**vue-qs v0.1.18-beta.7**](../../../README.md)

***

[vue-qs](../../../README.md) / serializers

# serializers

Serializers namespace for convenience

## Example

```ts
import { serializers } from 'vue-qs';

const page = queryRef('page', {
  codec: serializers.numberCodec
});
```

## References

### stringCodec

Re-exports [stringCodec](../../../variables/stringCodec.md)

***

### numberCodec

Re-exports [numberCodec](../../../variables/numberCodec.md)

***

### booleanCodec

Re-exports [booleanCodec](../../../variables/booleanCodec.md)

***

### dateISOCodec

Re-exports [dateISOCodec](../../../variables/dateISOCodec.md)

***

### createJsonCodec

Re-exports [createJsonCodec](../../../functions/createJsonCodec.md)

***

### createArrayCodec

Re-exports [createArrayCodec](../../../functions/createArrayCodec.md)

***

### createEnumCodec

Re-exports [createEnumCodec](../../../functions/createEnumCodec.md)

***

### QueryCodec

Re-exports [QueryCodec](../../../type-aliases/QueryCodec.md)

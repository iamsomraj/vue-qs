# API 参考

API 文档目前仅提供英文版本。请访问主要的 API 文档以获取完整的参考资料。

[查看完整 API 文档（英文）](/api/)

## 主要功能

- **类型安全的查询参数**: 完全类型化的 URL 查询参数状态管理
- **Vue 3 集成**: 专为 Vue 3 Composition API 设计
- **响应式**: 与 Vue 的响应式系统无缝集成
- **Vue Router 支持**: 内置 Vue Router 适配器
- **自定义序列化器**: 支持自定义数据类型的序列化

## 快速导航

以下是一些重要的 API 类别（链接到英文文档）：

### 核心函数

- [useQueryRef](/api/functions/useQueryRef.md) - 创建响应式查询参数引用
- [useQueryReactive](/api/functions/useQueryReactive.md) - 创建响应式查询参数对象

### 适配器

- [createVueRouterAdapter](/api/functions/createVueRouterAdapter.md) - Vue Router 适配器
- [createHistoryAdapter](/api/functions/createHistoryAdapter.md) - History API 适配器
- [createHashAdapter](/api/functions/createHashAdapter.md) - 哈希适配器（类似 VueUse）

### 编解码器

- [stringCodec](/api/variables/stringCodec.md) - 字符串编解码器
- [numberCodec](/api/variables/numberCodec.md) - 数字编解码器
- [booleanCodec](/api/variables/booleanCodec.md) - 布尔值编解码器
- [dateISOCodec](/api/variables/dateISOCodec.md) - ISO 日期编解码器

### 工具函数

- [createJsonCodec](/api/functions/createJsonCodec.md) - 创建 JSON 编解码器
- [createArrayCodec](/api/functions/createArrayCodec.md) - 创建数组编解码器
- [createEnumCodec](/api/functions/createEnumCodec.md) - 创建枚举编解码器

---

_完整的 API 文档请访问 [英文版本](/api/)_

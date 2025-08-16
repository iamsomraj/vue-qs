# 快速开始

::: warning 积极开发提醒
该库目前正在积极开发中，**尚未准备好用于生产环境**。API 可能在版本之间发生重大变化。请谨慎使用，并预期会有破坏性更改。
:::

**Type‑safe, reactive URL query params for Vue** - 把常用的界面状态（搜索词、页码、筛选条件）放进 URL，这样刷新、分享、前进/后退都能保持。`vue-qs` 提供两个组合式函数和现代化错误处理来轻松实现这些功能。

## 安装

```bash
npm i vue-qs
# 或者
pnpm add vue-qs
# 或者
bun add vue-qs
```

对等依赖：`vue@^3.3`。可选：`vue-router@^4.2`（需要路由集成时）。

## 单个参数 (ref)

```vue
<script setup lang="ts">
import { queryRef } from 'vue-qs';

// 绑定到 ?name=... 缺失时使用默认值
const name = queryRef('name', { defaultValue: '' });
</script>

<template>
  <input v-model="name" placeholder="你的名字" />
</template>
```

## 多个参数 (reactive 对象)

```vue
<script setup lang="ts">
import { queryReactive } from 'vue-qs';

const queryState = queryReactive({
  search: { defaultValue: '' },
  page: {
    defaultValue: 1,
    parse: (value) => (value ? Number(value) : 1),
    serializeFunction: (value) => String(value),
  },
});
</script>

<template>
  <input v-model="queryState.search" />
  <button @click="queryState.page++">下一页</button>
</template>
```

## Hook 返回什么

- `queryRef(name, options)` → 一个普通 ref。
- `queryReactive(schema, options)` → 一个响应式对象。
- 值等于默认值时默认不出现在 URL（可通过 `shouldOmitDefault: false` 关闭）。

继续查看 示例 / 双向同步 / 编解码器 获取更多用法。

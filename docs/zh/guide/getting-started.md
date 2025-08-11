# 快速开始

vue-qs 让你的 Vue 3 应用把状态保存在 URL 查询参数中，类型安全、用法简洁。

## 安装

```bash
npm i vue-qs
# 或者
pnpm add vue-qs
# 或者
bun add vue-qs
```

对等依赖：`vue@^3.3`。`vue-router@^4.2` 可选。

## 单个参数（Ref）

```vue
<script setup lang="ts">
import { useQueryRef } from 'vue-qs';

const name = useQueryRef('name', { default: '' });
</script>

<template>
  <input v-model="name" placeholder="你的名字" />
</template>
```

## 多个参数（Reactive 对象）

```vue
<script setup lang="ts">
import { useQueryReactive } from 'vue-qs';

const { state } = useQueryReactive({
  search: { default: '' },
  page: { default: 1, codec: { parse: Number, serialize: (n: number) => String(n) } },
});
</script>

<template>
  <input v-model="state.search" />
  <button @click="state.page++">下一页</button>
</template>
```

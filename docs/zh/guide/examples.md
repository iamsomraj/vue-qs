# 示例

汇总一些常用的完整组件示例。

## 基础表单组件

使用 `queryRef` 展示不同查询参数类型的完整 Vue 组件：

```vue
<script setup lang="ts">
import { serializers, queryRef } from 'vue-qs';

const name = queryRef('name', { defaultValue: '', parse: String });

const itemCount = queryRef('itemCount', { defaultValue: 0, codec: serializers.numberCodec });

const isPublished = queryRef('isPublished', {
  defaultValue: false,
  codec: serializers.booleanCodec,
});

const tags = queryRef<string[]>('tags', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.stringCodec),
});
</script>

<template>
  <div class="form-container">
    <h2>基础表单示例</h2>

    <div class="field">
      <label>姓名：</label>
      <input v-model="name" placeholder="您的姓名" />
    </div>

    <div class="field">
      <label>项目数量：</label>
      <input v-model="itemCount" type="number" placeholder="项目数量" />
    </div>

    <div class="field">
      <label>
        <input v-model="isPublished" type="checkbox" />
        已发布
      </label>
    </div>

    <div class="field">
      <label>标签：</label>
      <select v-model="tags" multiple>
        <option v-for="tag in ['vue', 'javascript', 'frontend', 'backend']" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </select>
    </div>

    <div class="output">
      <h3>当前状态：</h3>
      <pre>{{ JSON.stringify({ name, itemCount, isPublished, tags }, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.field {
  margin-bottom: 15px;
}

.field label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.field input[type='text'],
.field input[type='number'],
.field select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.field select[multiple] {
  height: 100px;
}

.output {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.output pre {
  margin: 0;
  white-space: pre-wrap;
}
</style>
```

## 混合使用 queryRef 和 queryReactive 组件

同时展示 `queryRef` 和 `queryReactive` 的组件：

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { serializers, queryRef, queryReactive } from 'vue-qs';

// 使用 queryRef 进行类别选择
const category = queryRef<'books' | 'music' | 'games'>('category', {
  defaultValue: 'books',
  codec: serializers.createEnumCodec(['books', 'music', 'games'] as const),
});

// 使用 queryReactive 管理分组的过滤器状态
const filters = queryReactive({
  search: { defaultValue: '' },
  page: { defaultValue: 1, codec: serializers.numberCodec },
  minPrice: { defaultValue: 0, codec: serializers.numberCodec },
  maxPrice: { defaultValue: 1000, codec: serializers.numberCodec },
  inStock: { defaultValue: false, codec: serializers.booleanCodec },
});

// 组合两种状态的计算属性
const searchSummary = computed(() => ({
  category: category.value,
  totalFilters: Object.values(filters).filter(Boolean).length,
  ...filters,
}));

// 重置所有过滤器的方法
const resetFilters = () => {
  filters.search = '';
  filters.page = 1;
  filters.minPrice = 0;
  filters.maxPrice = 1000;
  filters.inStock = false;
};

// 应用快速过滤器的方法
const applyQuickFilter = (type: 'cheap' | 'expensive' | 'available') => {
  switch (type) {
    case 'cheap':
      filters.minPrice = 0;
      filters.maxPrice = 50;
      filters.inStock = true;
      break;
    case 'expensive':
      filters.minPrice = 500;
      filters.maxPrice = 1000;
      break;
    case 'available':
      filters.inStock = true;
      filters.page = 1;
      break;
  }
};
</script>

<template>
  <div class="search-container">
    <h2>产品搜索</h2>

    <!-- 使用 queryRef 的类别选择 -->
    <div class="section">
      <h3>类别 (queryRef)</h3>
      <div class="category-buttons">
        <button
          v-for="cat in ['books', 'music', 'games']"
          :key="cat"
          :class="{ active: category === cat }"
          @click="category = cat"
        >
          {{ { books: '图书', music: '音乐', games: '游戏' }[cat] }}
        </button>
      </div>
    </div>

    <!-- 使用 queryReactive 的过滤器 -->
    <div class="section">
      <h3>过滤器 (queryReactive)</h3>

      <div class="field">
        <label>搜索：</label>
        <input v-model="filters.search" placeholder="搜索产品..." />
      </div>

      <div class="field">
        <label>页码：</label>
        <input v-model="filters.page" type="number" min="1" />
      </div>

      <div class="field-group">
        <div class="field">
          <label>最低价格：</label>
          <input v-model="filters.minPrice" type="number" min="0" />
        </div>

        <div class="field">
          <label>最高价格：</label>
          <input v-model="filters.maxPrice" type="number" min="0" />
        </div>
      </div>

      <div class="field">
        <label>
          <input v-model="filters.inStock" type="checkbox" />
          仅显示有库存商品
        </label>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="section">
      <h3>快速过滤器</h3>
      <div class="quick-buttons">
        <button @click="applyQuickFilter('cheap')">便宜商品</button>
        <button @click="applyQuickFilter('expensive')">昂贵商品</button>
        <button @click="applyQuickFilter('available')">有库存商品</button>
        <button @click="resetFilters()" class="reset">重置全部</button>
      </div>
    </div>

    <!-- 状态显示 -->
    <div class="output">
      <h3>当前搜索状态：</h3>
      <pre>{{ JSON.stringify(searchSummary, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  margin-bottom: 25px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.section h3 {
  margin-top: 0;
  color: #333;
}

.category-buttons,
.quick-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category-buttons button,
.quick-buttons button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.category-buttons button:hover,
.quick-buttons button:hover {
  background-color: #f0f0f0;
}

.category-buttons button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.quick-buttons button.reset {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.quick-buttons button.reset:hover {
  background-color: #c82333;
}

.field {
  margin-bottom: 15px;
}

.field-group {
  display: flex;
  gap: 15px;
}

.field-group .field {
  flex: 1;
}

.field label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.field input[type='text'],
.field input[type='number'] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.output {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.output pre {
  margin: 0;
  white-space: pre-wrap;
  font-size: 14px;
}
</style>
```

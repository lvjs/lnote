<script lang="ts" setup>
import { ref } from "vue";
import noteStore from "../service/dataService";

// todo: search only (bookmark) notes first。then add history, tab, system bookmark(highlight if match lnote)
const options = ref([] as string[]);
const loading = ref(false);

const handleSearch = (value: string) => {
  if (value) {
    loading.value = true;
    noteStore.getNotesByKeyword(value).then((matchedNotes) => {
      console.log("%c match notes:", "color: green;font-size:30px;");
      console.dir(matchedNotes);
      // todo: 处理搜索框展示 && 搜索结果展示
      options.value = matchedNotes.map((note) => `${note.title}`);
      loading.value = false;
    });
  } else {
    options.value = [];
  }
};
</script>
<template>
  <view class="search-container">
    <a-select
      :loading="loading"
      placeholder="search for notes, tabs, history and system bookmarks"
      allow-search
      @search="handleSearch"
      :filter-option="false"
      :options="options"
    >
      <template #label="{ data }">
        <span><icon-plus />{{ data?.label }}</span>
      </template>
      <template #arrow-icon>
        <icon-search />
      </template>
      <template #option="{ data }">
        <div>{{ data.label }} : {{ data.value }}</div>
      </template>
      <template #empty>
        <div style="opacity: 0">hide empty tips</div>
      </template>
    </a-select>
  </view>
</template>

<style lang="less">
@media (min-width: 500px) {
  .search-container {
    width: 400px;
    display: flex;
    align-items: center;
  }
}
@media (min-width: 1024px) {
  .search-container {
    width: 800px;
    display: flex;
    align-items: center;
  }
}
.arco-select-dropdown {
  background: none;
  border: none;
  box-shadow: none;
}
.search-container {
  input {
    font-size: 30px !important;
    line-height: 1.6 !important;
  }
}
</style>

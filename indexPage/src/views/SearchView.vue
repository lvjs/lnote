<script lang="tsx" setup>
import { ref } from "vue";
import noteStore from "../service/dataService";
import Hightlight from "../components/Highlight";
import router from "@/router";
import globalData from "@/service/global";
import { sendEventToTab } from "../service/event";

// ctrl/cmd + enter  && click to go to bookmark(if has) vs enter to view & edit note
// todo1: search only (bookmark) notes first。then add history, tab, system bookmark(highlight if match lnote) <use worker to fetch>
const options = ref([] as Record<string, any>[]);
const loading = ref(false);

const handleSearch = (keyword: string) => {
  if (keyword) {
    loading.value = true;
    noteStore.getNotesByKeyword(keyword).then((matchedNotes) => {
      console.log("%c match notes:", "color: green;font-size:30px;");
      console.log(matchedNotes);
      options.value = matchedNotes.map((note) => {
        return {
          label: note.title,
          value: note.id,
          url: note.url,
          render: () => {
            return (
              <div class="note-option">
                <a-space class="note-option__section">
                  <a-tag color="arcoblue">lnote</a-tag>
                  <div class="note-option__title">
                    {Hightlight({ text: note.title, keyword })}
                  </div>
                </a-space>
                {note.url ? (
                  <div class="note-option__section note-option__url">
                    {Hightlight({ text: note.url, keyword })}
                  </div>
                ) : null}
                {note.note || note.tags?.length ? (
                  <a-space class="note-option__section">
                    {note.tags?.map((tag) => {
                      return (
                        <a-tag color="blue">
                          {Hightlight({ text: tag, keyword })}
                        </a-tag>
                      );
                    })}
                    {note.note ? (
                      <div>{Hightlight({ text: note.note, keyword })}</div>
                    ) : null}
                  </a-space>
                ) : null}
              </div>
            );
          },
        };
      });
      loading.value = false;
    });
  } else {
    options.value = [];
  }
};
type ISelectValChange =
  | string
  | number
  | Record<string, any>
  | (string | number | Record<string, any>)[];
async function handleValChange<T extends ISelectValChange>(noteId: T) {
  console.log("%c valchange", "font-size: 30px; color: blue;");
  // console.log(
  //   "globalData.lastPressedKey?.metaKey",
  //   globalData.lastPressedKey?.metaKey
  // );
  if (
    globalData.lastPressedKey?.metaKey ||
    globalData.lastPressedKey?.ctrlKey
  ) {
    // router.push({ name: "home" });
    const url = options.value.filter((item) => item.value === noteId)?.[0].url;
    if (url) {
      // todo1: check if there is opened tab which has same url with option, if does, active it instead of open a new tab.
      if (import.meta.env.DEV) {
        window.open(url);
      } else {
        // 发送关闭弹窗事件
        await sendEventToTab("togglePopWindow");
        const winConfig = { url, active: true };
        chrome.tabs.create(winConfig, (e) => {
          console.log("openNewTab", e);
        });
      }
    }
  } else {
    router.push({ name: "bookmark", params: { id: noteId as string } });
  }
}
</script>
<template>
  <view class="search-container">
    <a-select
      :loading="loading"
      placeholder="search for notes, tabs, history and system bookmarks"
      allow-search
      :filter-option="false"
      :options="options"
      @search="handleSearch"
      @change="handleValChange"
    >
      <!-- <template #label="{ data }">
        <span><icon-plus />{{ data?.label }}</span>
      </template> -->
      <template #arrow-icon>
        <icon-search />
      </template>
      <!-- <template #option="{ data }">
        <div>{{ data.label }} : {{ data.value }}</div>
      </template> -->
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
.arco-scrollbar {
  box-shadow: 2px 2px 6px 3px rgba(212, 201, 201, 0.5);
}
.search-container {
  font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 14px;
  input {
    font-size: 20px !important;
    line-height: 1.6 !important;
  }
}
.note-option {
  display: flex;
  flex-direction: column;
  // background: #f2f2f2;
  line-height: 1.2;
  padding: 4px 0;
  &__section {
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 2px;
  }
  &__title {
    font-size: 16px;
    // padding-left: 6px;
  }
  &__url {
    color: #0069c2;
  }
}
.arco-select-option {
  border-bottom: solid 1px #cccccc;
  &:last-child {
    border-bottom: none;
  }
}
.arco-select-dropdown-list-wrapper {
  max-height: 500px;
}
</style>

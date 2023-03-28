<script setup lang="ts">
import { reactive, ref } from "vue";
import noteStore from "../service/dataService";
import type { IRecord } from "../service/schema";

const formRef = ref<HTMLFormElement>();
const form = reactive({
  title: "",
  url: "",
  tags: [],
  note: "",
  syncBrowser: true,
} as IRecord & { syncBrowser: boolean });
// 记录匹配中的note，提交时采用更新操作（id, createTime不变，updateTime自动生成，其他使用form值覆盖）
let matchNote: IRecord;
let allTags: string[] = [];
noteStore.getTags().then((res) => {
  console.log("%c all tags:", "color: green; font-size: 20px;");
  // console.log(res[0].toJSON());
  // @ts-ignore todo: add ts def to res
  allTags = allTags.concat(res.map((item) => item.get("content")));
  console.log(allTags);
});

// todo 适配chrome ext. 检测&分支
// 获取当前页面地址&查询地址对应的note，并填充到编辑表里面
async function getNoteByUrlAndFill() {
  let url: string;
  let tabInfo: Record<string, any>;
  if (import.meta.env.DEV) {
    url = window.location.href;
  } else {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    const [tab] = await chrome.tabs.query(queryOptions);
    tabInfo = tab;
    url = tab.url || "";
  }
  await noteStore.getNotes({ url }).then((res) => {
    console.log("url", url);
    console.log("%c 拉取url对应的note：", "color: green; font-size: 20px;");
    console.dir(res);
    if (res?.[0]) {
      matchNote = res[0].toJSON();
      form.title = matchNote.title;
      form.url = matchNote.url;
      form.tags = matchNote.tags;
      form.note = matchNote.note;
    } else {
      if (tabInfo) {
        form.title = tabInfo.title;
        form.url = tabInfo.url;
      }
      // todo p2: 打开popWindow时传递meta.description并自动填充到note里面
      // const metaDescription = document.querySelector('meta[name="description"]').getAttribute('content');
    }
  });
}
getNoteByUrlAndFill();
function handleTagChange(
  value:
    | string
    | number
    | Record<string, any>
    | (string | number | Record<string, any>)[]
) {
  if (Array.isArray(value)) {
    value.forEach((element) => {
      if (typeof element === "string" && allTags.indexOf(element) === -1) {
        noteStore.addTag({ content: element });
        allTags.push(element);
      }
    });
  }
}
function onClear() {
  console.error("clear");
}
const handleSubmit = (data: any) => {
  const note = { ...data.values };
  note.sync = 0;
  if (note.syncBrowser) {
    // todo later: add or modify bookmark;
  }
  delete note.syncBrowser;
  // console.log(data);
  if (matchNote?.id) {
    noteStore.updateNote({ ...matchNote, ...note });
  } else {
    noteStore.addNote(note);
  }
};
function clearForm() {
  formRef.value?.resetFields();
}
</script>
<template>
  <a-form
    ref="formRef"
    :model="form"
    layout="vertical"
    :style="{ width: '600px' }"
    @submit="handleSubmit"
  >
    <a-form-item field="title" tooltip="default fill pageTitle" label="Title">
      <a-input
        v-model="form.title"
        placeholder="please enter your username..."
      />
    </a-form-item>
    <a-form-item field="url" label="Url">
      <a-input v-model="form.url" />
    </a-form-item>
    <a-form-item field="tags" label="Tags">
      <a-select
        v-model="form.tags"
        @change="handleTagChange"
        @clear="onClear"
        multiple
        allow-create
        allow-clear
        placeholder="select tags or press Enter to create new tag"
      >
        <a-option v-for="tag in allTags" :key="tag">{{ tag }}</a-option>
      </a-select>
    </a-form-item>
    <a-form-item field="note" label="Note">
      <a-textarea
        v-model="form.note"
        placeholder="please enter your message"
        :auto-size="{
          minRows: 2,
        }"
      />
      <!-- <template #extra>
        <div>建议输入你的个人理解或者内容要点</div>
      </template> -->
    </a-form-item>
    <a-form-item field="isRead">
      <a-checkbox v-model="form.syncBrowser">
        sync browser bookmark
      </a-checkbox>
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button html-type="submit">Submit</a-button>
        <a-button @click="clearForm">Reset</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<style>
main {
  width: 400px;
}
</style>

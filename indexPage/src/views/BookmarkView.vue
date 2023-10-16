<script setup lang="ts">
import { reactive, ref, watch } from "vue";
// import { useAttrs } from "vue";
import { useRoute } from "vue-router";
import noteStore from "../service/dataService";
import { sendEventToTab } from "../service/event";
import type { IRecord } from "../service/schema";
import type { Ref } from "vue";
import { app } from "../main";

// const attrs = useAttrs();
// console.error("attrs", attrs);
const formRef = ref<HTMLFormElement>();
const form = reactive({
  title: "",
  url: "",
  tags: [],
  note: "",
} as IRecord);
// 记录匹配中的note，提交时采用更新操作（id, createTime不变，updateTime自动生成，其他使用form值覆盖）
const currentNote: Ref<IRecord> = ref({ title: "" });
let allTags: string[] = [];
noteStore.getTags().then((res) => {
  console.log("%c all tags:", "color: green; font-size: 20px;");
  // console.log(res[0].toJSON());
  // @ts-ignore todo: add ts def to res
  allTags = allTags.concat(res.map((item) => item.get("content")));
  console.log(allTags);
});

let url: string | undefined;
let tabInfo: Record<string, any>;

const route = useRoute();
const noteId = route.params.id;

// &查询地址 or 参数对应的note，并填充到编辑表里面
async function fetchNote(noteId: string) {
  if (!noteId && !url) {
    if (import.meta.env.DEV) {
      url = window.location.href;
    } else {
      let queryOptions = { active: true, lastFocusedWindow: true };
      // `tab` will either be a `tabs.Tab` instance or `undefined`.
      const [tab] = await chrome.tabs.query(queryOptions);
      tabInfo = tab;
      url = tab.url as string;
    }
  }
  const searchParams = noteId ? { id: noteId } : url ? { url } : null;
  noteStore.getNotes(searchParams).then((res) => {
    console.log("url", url);
    console.log("%c 拉取到的note：", "color: green; font-size: 20px;");
    console.dir(res);
    if (res?.[0]) {
      const matchNote = res[0].toJSON() as IRecord;

      currentNote.value = matchNote;

      form.title = matchNote.title;
      form.url = matchNote.url;
      form.tags = matchNote.tags;
      form.note = matchNote.note;
    } else {
      if (tabInfo) {
        form.title = tabInfo.title;
        form.url = tabInfo.url;
      } else if (url) {
        form.url = url;
      }
      // todo p2: 打开popWindow时传递meta.description并自动填充到note里面
      // const metaDescription = document.querySelector('meta[name="description"]').getAttribute('content');
    }
  });
}
// if use await in top level of setup, you would get empty content, to solve that, you should wrap it with Suspense
// https://stackoverflow.com/questions/64009348/why-did-i-get-blank-empty-content-when-i-used-async-setup-in-vue-js-3
// <template>
//  <Suspense>
//    <MyAsyncComponent />
//  </Suspense>
// </template>
fetchNote(noteId as string);
watch(
  () => route.params.id,
  (noteId) => {
    fetchNote(noteId as string);
  }
);
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
function checkSubmit(type = "update") {
  if (!form.title) {
    app.config.globalProperties.$message.error({
      id: "bookmarkview",
      content: `标题不能为空`,
      duration: 1000,
    });
    return false;
  }

  if (!form.url && !form.note) {
    app.config.globalProperties.$message.error({
      id: "bookmarkview",
      content: `网址和笔记内容不能同时为空`,
      duration: 1000,
    });
    return false;
  }
  if (type !== "update") {
    return true;
  }
  // diff currentNote and form values
  const diffKeys = ["title", "url", "note"];
  for (const key of diffKeys) {
    if (
      form[key as keyof IRecord] !== currentNote.value[key as keyof IRecord]
    ) {
      return true;
    }
  }
  return JSON.stringify(form.tags) !== JSON.stringify(currentNote.value.tags);
}
function onClear() {
  console.log("clear");
}
async function handleSubmit(data: any) {
  const note = { ...data.values };
  note.sync = 0;
  if (currentNote.value.id) {
    if (!checkSubmit()) {
      return false;
    }
    const res = await noteStore.updateNote({ ...currentNote.value, ...note });
    currentNote.value = res;
    app.config.globalProperties.$message.success({
      id: "bookmarkview",
      content: `更新成功`,
      duration: 1000,
    });
  } else {
    if (!checkSubmit("add")) {
      return false;
    }
    const res = await noteStore.addNote(note);
    currentNote.value = res;
    app.config.globalProperties.$message.success({
      id: "bookmarkview",
      content: `添加成功`,
      duration: 1000,
    });
    setTimeout(() => {
      sendEventToTab("closePopWindow");
    }, 1000);
  }
}
async function altAndCreateNew() {
  const note = { ...form };
  note.sync = 0;
  if (!checkSubmit("add")) {
    return false;
  }
  const res = await noteStore.addNote(note);
  currentNote.value = res;
  app.config.globalProperties.$message.success({
    id: "bookmarkview",
    content: `另存成功`,
    duration: 1000,
  });
}
let deletingDoc = false;
async function deleteNote() {
  if (!currentNote.value.id) {
    return;
  }
  if (deletingDoc) {
    return;
  }
  deletingDoc = true;
  const id = currentNote.value.id;
  const deleteDoc = await noteStore.deleteNote(id);

  deletingDoc = false;
  if (
    deleteDoc &&
    (deleteDoc.toJSON() as IRecord).id === currentNote.value.id
  ) {
    currentNote.value = {};
    app.config.globalProperties.$message.success({
      id: "bookmarkview",
      content: `删除成功`,
      duration: 1000,
    });
  }
}
// function clearForm() {
//   formRef.value?.resetFields();
// }
</script>
<template>
  <a-form
    ref="formRef"
    :model="form"
    layout="vertical"
    :style="{ width: '600px', padding: '0 20px' }"
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
    <a-form-item>
      <a-space>
        <a-button html-type="submit" type="primary"
          ><icon-sync v-if="currentNote.id" />
          <icon-plus-circle v-if="!currentNote.id" />
          {{ currentNote.id ? "更新" : "创建" }}</a-button
        >
        <!-- <a-button @click="clearForm">Reset</a-button> -->
        <a-button type="outline" v-if="currentNote.id" @click="altAndCreateNew">
          <icon-share-internal />另存</a-button
        >

        <a-popconfirm
          v-if="currentNote.id"
          content="确认删除?"
          type="warning"
          @ok="deleteNote"
          ><a-button type="dashed"><icon-delete />删除</a-button>
          <!-- <icon-delete size="28px" /> -->
        </a-popconfirm>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<style>
main {
  width: 400px;
}
</style>

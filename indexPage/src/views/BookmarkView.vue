<script setup lang="ts">
import { reactive } from "vue";
import noteStore from "../service/dataService";

const form = reactive({
  title: "",
  url: "",
  tags: [],
  note: "",
  syncBrowser: true,
});
let allTags: string[] = [];
noteStore.getTags().then((res) => {
  console.log("getTags res:");
  console.dir(res);
  // console.log(res[0].toJSON());
  // @ts-ignore todo: add ts def to res
  allTags = allTags.concat(res.map((item) => item.get("content")));
  console.log("alltags", allTags);
});
function handleTagChange(
  value:
    | string
    | number
    | Record<string, any>
    | (string | number | Record<string, any>)[]
) {
  console.log("handleTagChange", value);
  if (Array.isArray(value)) {
    value.forEach((element) => {
      if (allTags.indexOf(element) === -1) {
        noteStore.addTag({ content: element });
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
  noteStore.addNote(note);
};
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
        <!-- <a-option>Section Three</a-option> -->
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
      <template #extra>
        <div>建议输入你的个人理解或者内容要点</div>
      </template>
    </a-form-item>
    <a-form-item field="isRead">
      <a-checkbox v-model="form.syncBrowser">
        sync browser bookmark
      </a-checkbox>
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button html-type="submit">Submit</a-button>
        <a-button @click="$refs.formRef.resetFields()">Reset</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<style>
main {
  width: 400px;
}
</style>

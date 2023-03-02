<script setup lang="ts">
import { reactive } from "vue";
const form = reactive({
  title: "",
  url: "",
  tags: [],
  note: "",
  syncBrowser: true,
});
const handleSubmit = (data: any) => {
  console.log(data);
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
        multiple
        allow-create
        placeholder="select tags or press Enter to create new tag"
      >
        <a-option value="section one">Section One</a-option>
        <a-option value="section two">Section Two</a-option>
        <a-option value="section three">Section Three</a-option>
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

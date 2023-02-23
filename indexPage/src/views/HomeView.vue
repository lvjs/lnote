<script setup lang="ts">
import TheWelcome from "../components/TheWelcome.vue";
import { IconUser } from "@arco-design/web-vue/es/icon";
</script>

<template>
  <main>
    <TheWelcome />
    <a-space size="large">
      <a-avatar>A</a-avatar>
      <a-avatar :style="{ backgroundColor: '#3370ff' }">
        <IconUser />
      </a-avatar>
      <a-avatar :style="{ backgroundColor: '#14a9f8' }">Arco</a-avatar>
      <a-avatar :style="{ backgroundColor: '#00d0b6' }">Design</a-avatar>
      <a-avatar>
        <img
          alt="avatar"
          src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
        />
      </a-avatar>
    </a-space>
  </main>
</template>

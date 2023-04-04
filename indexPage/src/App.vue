<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import "./service/event";

console.log("window.location", window.location);
// todo: add state manager here to go to proper router
setTimeout(() => {
  window.location.hash = "#/bookmark";
}, 0);
</script>

<template>
  <div class="main-container">
    <NavBar />
    <RouterView />
  </div>
</template>
<style lang="less">
.main-container {
  background-color: var(--color-background);
  padding: 5px 5px 10px 5px;
}
iframe {
  .main-container {
    box-shadow: 0px 0px 6px 6px rgba(212, 201, 201, 0.5);
  }
}
</style>

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
<style>
.main-container {
  background-color: var(--color-background);
  padding: 30px;
}
</style>

<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
console.log("window.location", window.location);
// todo: add state manager here to go to proper router
setTimeout(() => {
  window.location.hash = "#/about";
}, 100);
</script>

<template>
  <NavBar />

  <RouterView />
</template>

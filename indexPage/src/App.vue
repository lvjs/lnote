<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
console.log("window.location", window.location);
// setTimeout(() => {
//   window.location.hash = "#/about";
// }, 4000);
</script>

<template>
  <NavBar />

  <RouterView />
</template>

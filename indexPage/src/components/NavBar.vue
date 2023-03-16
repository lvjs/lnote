<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/bookmark">bookmark</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style lang="less">
header {
  line-height: 1.5;
  background: #fff;
}
.wrapper {
  opacity: 0.2;
  background: #fff;
  &:hover {
    background: aliceblue;
    opacity: 1;
  }
}
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  display: grid;
  grid-auto-flow: column;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>

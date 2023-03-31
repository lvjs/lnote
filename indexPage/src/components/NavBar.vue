<script setup lang="ts">
import { RouterLink } from "vue-router";
// todo: 增加路由回退按钮
// todo: icon replace router
// todo: add nav forward and nav back button(use two stack)
// const router = createRouter({ ... })

// router.beforeEach((to, from) => {
//   // ...
//   // explicitly return false to cancel the navigation
//   return false
// })
// router.beforeEach(async (to, from) => {
//   if (
//     // make sure the user is authenticated
//     !isAuthenticated &&
//     // ❗️ Avoid an infinite redirect
//     to.name !== 'Login'
//   ) {
//     // redirect the user to the login page
//     return { name: 'Login' }
//   }
// })
// router.beforeEach(async (to, from) => {
//   // canUserAccess() returns `true` or `false`
//   const canAccess = await canUserAccess(to)
//   if (!canAccess) return '/login'
// })
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/bookmark">bookmark</RouterLink>
        <RouterLink to="/search">Search Note</RouterLink>
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

import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
// import BookmarkView from "../views/BookmarkView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/bookmark/:id?",
      name: "bookmark",
      component: () => import("../views/BookmarkView.vue"),
    },
    {
      path: "/search",
      name: "search",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/SearchView.vue"),
    },
  ],
});

export default router;

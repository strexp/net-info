import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Home
  },
  {
    path: "/map",
    name: "3D Map",
    component: () => import("@/views/Map.vue")
  },
  {
    path: "/map/:proto",
    name: "3D Map",
    component: () => import("@/views/Map.vue")
  },
  {
    path: "/map2",
    name: "2D Map",
    component: () => import("@/views/Map2.vue")
  },
  {
    path: "/map2/:proto",
    name: "2D Map",
    component: () => import("@/views/Map2.vue")
  },
  {
    path: "/isp",
    name: "ISP",
    component: () => import("@/views/ISP.vue")
  },
  {
    path: "/isp/:proto",
    name: "ISP",
    component: () => import("@/views/ISP.vue")
  },
  {
    path: "/alerts",
    name: "Alerts",
    component: () => import("@/views/Alerts.vue")
  },
  {
    path: "/path",
    name: "Path",
    component: () => import("@/views/Path.vue"),
    children: [
      {
        path: ":fromasn",
        name: "Path Lookup",
        component: () => import("@/views/Path.vue"),
        children: [
          {
            path: ":toasn",
            name: "Path Find",
            component: () => import("@/views/Path.vue")
          }
        ]
      }
    ]
  },

  {
    path: "/asinfo/:asn",
    name: "AS Info",
    component: () => import("@/views/ASInfo.vue")
  },
  {
    path: "/registry",
    name: "DN42 Registry",
    component: () => import("@/views/Registry.vue")
  },
  {
    path: "/registry/:proto",
    name: "DN42 Registry",
    component: () => import("@/views/Registry.vue")
  },
  {
    path: "*",
    name: "404",
    component: () => import("@/views/404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes
});

export default router;

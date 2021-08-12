<template>
  <v-app>
    <NavBar />
    <Drawer />
    <v-main>
      <v-container
        :class="
          $route.path.includes('/map') ||
          $route.path.includes('/map2') ||
          $route.path.includes('/registry')
            ? 'full-screen'
            : ''
        "
      >
        <router-view :key="$route.fullPath" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/Layout/NavBar";
import Drawer from "@/components/Layout/Drawer";

export default {
  name: "App",
  components: {
    NavBar,
    Drawer
  },
  data: () => ({
    //
  })
};
</script>

<style scoped>
.full-screen {
  padding: 0;
  max-width: unset;
}
</style>

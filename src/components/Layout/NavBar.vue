<template>
  <v-app-bar dark color="primary" app>
    <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>

    <v-toolbar-title style="width: 300px">{{
      this.$route.name
    }}</v-toolbar-title>

    <NavSearch />

    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
import NavSearch from "./NavSearch";

export default {
  components: { NavSearch },
  methods: {
    toggleDrawer() {
      this.$store.commit("toggleDrawer");
    },
  },
};
</script>

<style></style>

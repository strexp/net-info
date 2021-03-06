<template>
  <v-navigation-drawer v-model="showDrawer" app>
    <v-list-item>
      <v-list-item-content>
        <v-img :src="$vuetify.theme.dark ? logo_dark : logo" class="mb-2" />
      </v-list-item-content>
    </v-list-item>

    <v-divider />
    <!-- <v-list-item>
        <v-switch label="Internet"></v-switch>
    </v-list-item>
    <v-divider /> -->

    <v-list nav>
      <v-list-item
        link
        v-for="item in list_item"
        :key="item.url"
        :to="item.url"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.desc }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider />
      <v-footer>
        <span class="font-weight-light">SE BGP Info</span>
        <v-spacer />
        <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
          <v-icon>{{
            $vuetify.theme.dark ? "mdi-brightness-7" : "mdi-brightness-4"
          }}</v-icon>
        </v-btn>
      </v-footer>
    </template>
  </v-navigation-drawer>
</template>

<script>
import logo from "@/assets/se.svg";
import logo_dark from "@/assets/se.dark.svg";

export default {
  data: () => ({
    logo: logo,
    logo_dark: logo_dark,
    list_item: [
      {
        url: "/",
        icon: "mdi-view-dashboard",
        desc: "Dashboard",
        type: "all"
      },
      {
        url: "/map",
        icon: "mdi-map",
        desc: "3D Map",
        type: "dn42"
      },
      {
        url: "/map2",
        icon: "mdi-map",
        desc: "2D Map",
        type: "dn42"
      },
      {
        url: "/isp",
        icon: "mdi-network",
        desc: "ISPs",
        type: "dn42"
      },
      {
        url: "/alerts",
        icon: "mdi-alert",
        desc: "Alerts",
        type: "dn42"
      },
      {
        url: "/path",
        icon: "mdi-graph",
        desc: "Path",
        type: "dn42"
      },
      {
        url: "/registry",
        icon: "mdi-book",
        desc: "Registry",
        type: "dn42"
      },
      {
        url: "/about",
        icon: "mdi-information",
        desc: "About",
        type: "all"
      }
    ]
  }),
  computed: {
    showDrawer: {
      get() {
        return this.$store.getters.drawerState;
      },
      set(val) {
        this.$store.commit("setDrawer", val);
      }
    }
  }
};
</script>

<style></style>

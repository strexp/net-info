<template>
  <v-list>
    <v-list-item
      v-for="route in routes"
      :key="'route6' in route ? route.route6[0] : route.route[0]"
      @click="
        {
        }
      "
    >
      <v-list-item-avatar tile>
        <gb-flag
          class="v-img"
          :code="
            'country' in route.inetnum
              ? GetCountryCode(route.inetnum.country)
              : ''
          "
          size="medium"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ "route6" in route ? route.route6[0] : route.route[0] }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{
            "netname" in route.inetnum
              ? route.inetnum.netname[0]
              : "Sub-allocation"
          }}
          {{ "descr" in route.inetnum ? "-" + route.inetnum.descr[0] : "" }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="route.visible">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on"> mdi-eye</v-icon>
          </template>
          <span>Visible</span>
        </v-tooltip>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: ["routes"],
  methods: {
    GetCountryCode(code) {
      switch (code[0].toLowerCase()) {
        case "uk":
          return "GB";
        default:
          return code[0].toLowerCase();
      }
    }
  }
};
</script>

<style></style>

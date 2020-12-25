<template>
  <v-card :color="color" dark>
    <v-icon large class="dashboard-icon">{{icon}}</v-icon>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-5">{{descr}}</div>
        <v-list-item-title class="text-h4 mb-3">
          <b>&nbsp; {{num}}</b>
        </v-list-item-title>
        <v-list-item-subtitle>{{title}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  props: ["title", "num", "descr", "color", "icon"]
};
</script>

<style lang="scss">
.dashboard-icon {
  position: absolute !important;
  right: 0;
  bottom: 0px;
  font-size: 100px !important;
  opacity: 0.25;
}
</style>

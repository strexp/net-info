<template>
  <div>
    <v-card tile v-if="node" class="infocard hidden-sm-and-down">
      <v-card-title>
        {{ node.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ node.asn }} <v-icon small @click="focus">mdi-location-enter</v-icon>
        <br />
        <v-icon small left>mdi-sigma</v-icon>Centrality: {{ node.centrality }}
      </v-card-subtitle>
      <v-divider />
      <v-row no-gutters>
        <v-col>
          <v-btn :to="'/asInfo/' + node.asn" block tile text
            ><v-icon color="grey" left>mdi-information</v-icon>Info</v-btn
          >
        </v-col>
        <v-col>
          <v-btn :to="'/path/' + node.asn" block tile text
            ><v-icon color="grey" left>mdi-graph</v-icon>Graph</v-btn
          >
        </v-col>
      </v-row>
      <v-divider />
      <v-card-text class="peers-view">
        <b>Peers: {{ node.peers.size }}</b
        ><br />
        <span
          @click="selectPeer(p)"
          v-for="p in Array.from(node.peers)"
          :key="p.id"
        >
          {{ p.name }}<br />
        </span>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn icon @click="switchHop2"
          ><v-icon>{{
            showHop2 ? "mdi-graph" : "mdi-graph-outline"
          }}</v-icon></v-btn
        >
        <v-btn icon @click="switchBg"
          ><v-icon>{{ showBg ? "mdi-earth" : "mdi-earth-off" }}</v-icon></v-btn
        >
        <v-btn icon @click="switchGlow"
          ><v-icon>{{
            showGlow ? "mdi-lightbulb-on" : "mdi-lightbulb-off"
          }}</v-icon></v-btn
        >
        <v-btn icon @click="switchText"
          ><v-icon>{{
            showText
              ? "mdi-format-text-variant"
              : "mdi-format-text-variant-outline"
          }}</v-icon></v-btn
        >

        <v-btn icon @click="switchBlur"
          ><v-icon>{{ showBlur ? "mdi-blur" : "mdi-blur-off" }}</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
    <v-btn
      fab
      fixed
      right
      small
      bottom
      color="primary"
      dark
      class="hidden-md-and-up"
      v-if="node && !mobileShow"
      @click="toggleMobileShow"
    >
      <v-icon>mdi-information-outline</v-icon>
    </v-btn>
    <v-card
      tile
      v-if="node && mobileShow"
      class="mobileinfocard hidden-md-and-up"
    >
      <v-card-title>
        {{ node.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ node.asn }} <v-icon small @click="focus">mdi-location-enter</v-icon>
        <br />
        <v-icon small left>mdi-sigma</v-icon>Centrality: {{ node.centrality }}
      </v-card-subtitle>
      <v-divider />
      <v-row no-gutters>
        <v-col>
          <v-btn :to="'/asInfo/' + node.asn" block tile text
            ><v-icon color="grey" left>mdi-information</v-icon>Info</v-btn
          >
        </v-col>
        <v-col>
          <v-btn :to="'/path/' + node.asn" block tile text
            ><v-icon color="grey" left>mdi-graph</v-icon>Graph</v-btn
          >
        </v-col>
      </v-row>
      <v-divider />
      <v-card-text class="peers-view">
        <b>Peers: {{ node.peers.size }}</b
        ><br />
        <span
          @click="selectPeer(p)"
          v-for="p in Array.from(node.peers)"
          :key="p.id"
        >
          {{ p.name }}<br />
        </span>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn icon @click="switchHop2"
          ><v-icon>{{
            showHop2 ? "mdi-graph" : "mdi-graph-outline"
          }}</v-icon></v-btn
        >
        <v-btn icon @click="switchBg"
          ><v-icon>{{ showBg ? "mdi-earth" : "mdi-earth-off" }}</v-icon></v-btn
        >
        <v-btn icon @click="switchGlow"
          ><v-icon>{{
            showGlow ? "mdi-lightbulb-on" : "mdi-lightbulb-off"
          }}</v-icon></v-btn
        >
        <v-btn icon @click="switchText"
          ><v-icon>{{
            showText
              ? "mdi-format-text-variant"
              : "mdi-format-text-variant-outline"
          }}</v-icon></v-btn
        >

        <v-btn icon @click="switchBlur"
          ><v-icon>{{ showBlur ? "mdi-blur" : "mdi-blur-off" }}</v-icon></v-btn
        ><v-spacer />
        <v-btn icon @click="toggleMobileShow"
          ><v-icon>mdi-close-box</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Bus from "@/bus";

export default {
  props: ["node"],
  data: () => ({
    mobileShow: false,
    showHop2: true,
    showBg: true,
    showGlow: true,
    showText: true,
    showBlur: false
  }),
  methods: {
    toggleMobileShow() {
      this.mobileShow = !this.mobileShow;
    },
    focus() {
      Bus.$emit("Focus");
    },
    selectPeer(peer) {
      this.node = peer;
      this.$emit("update:node", this.node);
    },
    switchHop2() {
      this.showHop2 = !this.showHop2;
      Bus.$emit("SwitchHop2", this.showHop2);
    },
    switchBg() {
      this.showBg = !this.showBg;
      Bus.$emit("SwitchBg", this.showBg);
    },
    switchGlow() {
      this.showGlow = !this.showGlow;
      Bus.$emit("SwitchGlow", this.showGlow);
    },
    switchText() {
      this.showText = !this.showText;
      Bus.$emit("SwitchText", this.showText);
    },
    switchBlur() {
      this.showBlur = !this.showBlur;
      Bus.$emit("SwitchBlur", this.showBlur);
    }
  }
};
</script>

<style lang="scss" scoped>
.infocard {
  position: absolute;
  right: 0px;
  top: 0px;
  max-width: 300px;
}

.mobileinfocard {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}

.peers-view {
  overflow-y: auto;
  max-height: 50vh;
}
</style>

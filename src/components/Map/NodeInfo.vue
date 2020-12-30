<template>
  <v-card tile v-if="node" class="infocard hidden-sm-and-down">
    <v-card-title>
      {{ node.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ node.asn }}
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
      <b>Peers: {{ node.peers.length }}</b
      ><br />
      <span @click="selectPeer(p)" v-for="p in node.peers" :key="p.id">
        {{ p.name }}<br />
      </span>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["node"],
  methods: {
    selectPeer(peer) {
      this.node = peer;
      this.$emit("update:node", this.node);
    },
  },
};
</script>

<style lang="scss" scoped>
.infocard {
  position: absolute;
  left: 0px;
  top: 0px;
  max-width: 300px;
}

.peers-view {
  overflow-y: auto;
  max-height: 50vh;
}
</style>

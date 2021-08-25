<template>
  <div id="maprender">
    <div id="content-wrapper">
      <network
        v-if="d == 3"
        :nodeList="nodes"
        :linkList="edges"
        :selected.sync="nodeSelected"
      ></network>
      <network2
        v-else
        :nodeList="nodes"
        :linkList="edges"
        :selected.sync="nodeSelected"
      ></network2>
    </div>
    <NodeInfo :node.sync="nodeSelected" />
  </div>
</template>

<script>
import network from "@/utils/d3network";
import network2 from "@/utils/d3network2";
import NodeInfo from "@/components/Map/NodeInfo";

export default {
  props: ["d", "proto"],
  data: () => ({
    nodes: [],
    edges: [],
    nodeSelected: null
  }),
  components: {
    network,
    network2,
    NodeInfo
  },
  mounted() {
    this.$ajax
      .get(
        process.env.VUE_APP_DATA_URL +
          "/graph/" +
          this.proto +
          ".json?rnd=" +
          Math.floor(Date.now() / 600000)
      )
      .then(response => {
        this.nodes = response.data.nodes;
        this.edges = response.data.edges;
        for (var i = 0; i < this.nodes.length; ++i) {
          var node = this.nodes[i];
          node.id = parseInt(node.id);
          //node.label = node.asn;
          node.val = node.size * 40 - 60;
          node.peers = new Set();
        }
        for (i = 0; i < this.edges.length; ++i) {
          var edge = this.edges[i];
          edge.id = i;
          edge.target = parseInt(edge.targetID);
          edge.source = parseInt(edge.sourceID);
          for (var n = 0; n < this.nodes.length; ++n) {
            if (this.nodes[n].id == edge.sourceID) {
              var sourceNode = this.nodes[n];
            } else if (this.nodes[n].id == edge.targetID) {
              var targetNode = this.nodes[n];
            }
          }
          if (!sourceNode || !targetNode) continue;
          sourceNode.peers.add(targetNode);
          targetNode.peers.add(sourceNode);
        }
      });
  }
};
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>

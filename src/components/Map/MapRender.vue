<template>
  <div id="maprender">
    <div id="content-wrapper">
      <network
        :nodeList="nodes"
        :linkList="edges"
        :linkDistance="150"
        :linkWidth="1"
        :nodeTextFontSize="0.6"
        :svgTheme="$vuetify.theme.dark ? 'dark' : 'light'"
        :selected.sync="nodeSelected"
      ></network>
    </div>
    <NodeInfo :node="nodeSelected" />
  </div>
</template>

<script>
import network from "@/utils/d3network";
import NodeInfo from "@/components/Map/NodeInfo";

export default {
  data: () => ({
    nodes: [],
    edges: [],
    nodeSelected: null
  }),
  components: {
    network,
    NodeInfo
  },
  mounted() {
    this.$ajax
      .get(
        process.env.VUE_APP_API_URL +
          "/graph.json?rnd=" +
          Math.floor(Date.now() / 600000)
      )
      .then(response => {
        this.nodes = response.data.nodes;
        this.edges = response.data.edges;
        for (var i = 0; i < this.nodes.length; ++i) {
          var node = this.nodes[i];
          node.id = parseInt(node.id);
          node.size = node.size * 5;
          node.peers = [];
        }
        for (i = 0; i < this.edges.length; ++i) {
          var edge = this.edges[i];
          edge.id = i;
          edge.target = parseInt(edge.targetID);
          edge.source = parseInt(edge.sourceID);
          for (var n = 0; n < this.nodes.length; ++n) {
            if (this.nodes[n].id == edge.sourceID) {
              var sourceNode = this.nodes[n];
            } else if (this.nodes[n].id == edge.targetID)
              var targetNode = this.nodes[n];
          }
          if (!sourceNode || !targetNode) continue;
          sourceNode.peers.push({ id: targetNode.id, label: targetNode.label });
          targetNode.peers.push({ id: sourceNode.id, label: sourceNode.label });
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

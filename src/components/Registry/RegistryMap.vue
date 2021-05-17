<template>
  <div id="chart" />
</template>

<script>
import Icicle from "icicle-chart";
export default {
  props: ["prefixes", "meta"],
  data: () => ({
    vis: null,
  }),
  methods: {
    getAttr(attr, obj) {
      if (attr in obj) return obj[attr];
      else return [null];
    },
    nodeColor(node) {
      switch (this.getAttr("status", this.meta[node.prefix])[0]) {
        case "ASSIGNED":
          return "#6F00AA";
        case "ASSIGNED PI":
          return "#6F00AA";
        case "ASSIGNED PA":
          return "#6F00AA";
        case "ALLOCATED PI":
          return "#AA00AA";
        case "ALLOCATED PA":
          return "#AA00AA";
        case "ALLOCATED":
          if (this.getAttr("mnt-by", this.meta[node.prefix])[0] !== "DN42-MNT")
            return "#AA00AA";
          else {
            var attr = this.getAttr("policy", this.meta[node.prefix])[0];
            if (attr == "reserved" || attr == "closed") return "#cc0000";
            if (attr == "ask") return "#0000cc";
            else return "#00cc00";
          }
        default:
          return "#cccccc";
      }
    },
    getTitle(node) {
      return this.getAttr("netname", this.meta[node.prefix])[0];
    },
    getContent(node) {
      var status = this.getAttr("status", this.meta[node.prefix])[0];
      var mnt = this.getAttr("mnt-by", this.meta[node.prefix])[0];
      return "Status: " + status + "<br>MNT: " + mnt + "<br>Size: " + node.size;
    },
  },
  mounted: function() {
    Icicle()
      .label("prefix")
      .size("size")
      .excludeRoot(true)
      .orientation("td")
      .color(this.nodeColor)
      .minSegmentWidth(0.3)
      .width(window.innerWidth)
      .height(window.innerHeight)
      .tooltipTitle(this.getTitle)
      .tooltipContent(this.getContent)
      .data(this.prefixes)("#chart");
  },
};
</script>

<style>
#chart {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div id="chart" />
</template>

<script>
import Icicle from "icicle-chart";
export default {
  props: ["prefixes", "meta"],
  data: () => ({
    vis: null
  }),
  methods: {
    getAttr(attr, obj) {
      if (!obj) return [null];
      if (attr in obj) return obj[attr];
      else return [null];
    },
    nodeColor(node) {
      switch (this.getAttr("status", this.meta[node.prefix])) {
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
          if (this.getAttr("mnt-by", this.meta[node.prefix]) !== "DN42-MNT")
            return "#AA00AA";
          else {
            var attr = this.getAttr("policy", this.meta[node.prefix]);
            if (attr == "reserved" || attr == "closed") return "#cc0000";
            if (attr == "ask") return "#0000cc";
            else return "#00cc00";
          }
        default:
          return "#cccccc";
      }
    },
    getTitle(node) {
      var tit = this.getAttr("netname", this.meta[node.prefix]);
      if (tit == null) return node.prefix;
      return tit;
    },
    getContent(node) {
      if (!this.meta[node.prefix]) return node.prefix;
      var status = this.getAttr("status", this.meta[node.prefix]);
      var mnt = this.getAttr("mnt-by", this.meta[node.prefix]);
      var rstr =
        "Status: " + status + "<br>MNT: " + mnt + "<br>Size: " + node.size;
      var pol = this.getAttr("policy", this.meta[node.prefix]);
      if (pol[0] !== null) rstr = rstr + "<br>Policy: " + pol;
      rstr = rstr + "<br>Prefix: " + node.prefix;
      return rstr;
    }
  },
  mounted() {
    Icicle()
      .label("prefix")
      .size("size")
      .children("children")
      .excludeRoot(true)
      .orientation("td")
      .color(this.nodeColor)
      .minSegmentWidth(0.2)
      .width(window.innerWidth)
      .height(window.innerHeight)
      .tooltipTitle(this.getTitle)
      .tooltipContent(this.getContent)
      .data(this.prefixes)("#chart");
  }
};
</script>

<style>
#chart {
  width: 100%;
  height: 100%;
}
</style>

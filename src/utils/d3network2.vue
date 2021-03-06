<template>
  <div id="map">
    <div id="container" />
  </div>
</template>

<script>
import Bus from "@/bus";
import * as Stats from "stats.js";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {
  Object3D,
  Color,
  CubeTextureLoader,
  Vector2,
  MOUSE
} from "three/build/three.min.js";

export default {
  props: ["nodeList", "linkList", "selected"],
  watch: {
    nodeList() {
      if (!this.Graph) this.genView();
    },
    showGlow(val) {
      if (!val)
        this.Graph.postProcessingComposer().removePass(this.filters.bloomPass);
      else this.Graph.postProcessingComposer().addPass(this.filters.bloomPass);
    },
    showText(val) {
      if (!val) {
        this.Graph.nodeThreeObject(() => {
          return null;
        }).nodeLabel(node => node.name);
      } else {
        this.Graph.nodeThreeObject(node => {
          const sprite = new SpriteText(node.name);
          sprite.material.depthWrite = false;
          sprite.color = "#999999";
          sprite.textHeight = node.size * 0.8;
          sprite.strokeWidth = "1";
          sprite.strokeColor = "#000000";
          sprite.position.z = node.size;
          sprite.renderOrder = 999;
          sprite.material.depthTest = false;
          sprite.material.depthWrite = false;
          sprite.onBeforeRender = function(renderer) {
            renderer.clearDepth();
          };
          return sprite;
        }).nodeLabel("");
      }
      this.refreshGraph();
    },
    selected() {
      this.highlightNodes.clear();
      this.highlight2Nodes.clear();
      if (this.selected) {
        this.highlightNodes.add(this.selected);
        this.selected.peers.forEach(neighbor => {
          this.highlightNodes.add(neighbor);
          if (this.showHop2)
            neighbor.peers.forEach(neighbor2 =>
              this.highlight2Nodes.add(neighbor2)
            );
        });
      }
      this.refreshGraph();
    }
  },
  data: () => ({
    Graph: null,
    highlightNodes: new Set(),
    highlight2Nodes: new Set(),
    stats: new Stats(),
    showHop2: true,
    showGlow: true,
    showText: true,
    ldrUrls: [
      "/static/skybox/right.png",
      "/static/skybox/left.png",
      "/static/skybox/top.png",
      "/static/skybox/bottom.png",
      "/static/skybox/front.png",
      "/static/skybox/back.png"
    ],
    filters: {
      bloomPass: null
    }
  }),
  mounted() {
    Bus.$on("Search", payload => {
      var selectedNode = this.nodeList.find(n => n.asn === payload);
      if (selectedNode) this.updateSelected(selectedNode);
    });
    Bus.$on("SwitchHop2", value => {
      this.selected = null;
      this.showHop2 = value;
    });
    Bus.$on("SwitchGlow", value => {
      this.showGlow = value;
    });
    Bus.$on("SwitchText", value => {
      this.showText = value;
    });
    this.stats.showPanel(0);
    this.$store.commit("setDrawer", false);
    this.stats.domElement.style.bottom = "0px";
    this.stats.domElement.style.top = "";
    this.stats.domElement.className += "hidden-sm-and-down";
    document.getElementById("map").appendChild(this.stats.dom);
  },
  methods: {
    refreshGraph: function() {
      var graph = this.Graph;
      graph
        .nodeColor(graph.nodeColor())
        .linkWidth(graph.linkWidth())
        .linkDirectionalParticles(graph.linkDirectionalParticles());
    },
    updateSelected(val) {
      this.selected = val;
      this.$emit("update:selected", this.selected);
    },
    genView: function() {
      this.highlightNodes = new Set();
      this.Graph = ForceGraph3D({ antialias: true, alpha: true });
      this.Graph(document.getElementById("container"))
        .graphData({
          nodes: this.nodeList,
          links: this.linkList
        })
        .nodeOpacity(1)
        .numDimensions(2)
        .linkResolution(32)
        .linkOpacity(0.3)
        .enableNavigationControls(true)
        .nodeLabel("")
        .nodeResolution(32)
        .nodeRelSize(1)
        .backgroundColor("#000000")
        .onEngineTick(() => {
          this.stats.end();
          this.stats.begin();
        })
        .nodeThreeObject(node => {
          const group = new Object3D();
          const sprite = new SpriteText(node.name);
          sprite.material.depthWrite = false;
          sprite.color = "#999999";
          sprite.textHeight = node.size * 0.7;
          sprite.strokeWidth = "1";
          sprite.strokeColor = "#000000";
          sprite.renderOrder = 999;
          sprite.material.depthTest = false;
          group.add(sprite);
          return group;
        })
        .nodeThreeObjectExtend(true)
        .nodeColor(node => {
          if (node === this.selected)
            return "rgba(0,255,255," + node.val / 10 + ")";
          if (this.highlightNodes.has(node))
            return "rgba(255,150,0," + node.val / 30 + ")";
          if (this.highlight2Nodes.has(node))
            return "rgba(255,30,0," + node.val / 20 + ")";
          return "rgba(150,150,150," + node.val / 30 + ")";
        })
        .linkColor(edge => {
          if (!this.selected) return "rgba(255,255,255,0.6)";
          if (edge.source == this.selected || edge.target == this.selected) {
            return "rgba(0,255,255,1)";
          } else if (
            (this.highlightNodes.has(edge.source) ||
              this.highlightNodes.has(edge.target)) &&
            this.showHop2
          ) {
            return "rgba(255,60,150,1)";
          } else return "rgba(255,255,255,0.8)";
        })
        .linkWidth(edge => {
          if (!this.selected) return 0;
          if (edge.source == this.selected || edge.target == this.selected) {
            return 0.4;
          } else if (
            (this.highlightNodes.has(edge.source) ||
              this.highlightNodes.has(edge.target)) &&
            this.showHop2
          ) {
            return 0.2;
          } else return 0.13;
        })
        .onBackgroundClick(() => {
          this.updateSelected(null);
        })
        .onLinkClick(() => {
          this.updateSelected(null);
        })
        .onNodeClick(node => {
          // no state change
          if (
            (!node && !this.highlightNodes.size) ||
            (node && this.selected === node)
          )
            return;

          this.updateSelected(node || null);
        });
      this.Graph.controls().noRotate = true;
      this.Graph.controls().mouseButtons = {
        LEFT: MOUSE.RIGHT,
        MIDDLE: MOUSE.MIDDLE,
        RIGHT: MOUSE.LEFT
      };
      this.filters.bloomPass = new UnrealBloomPass(
        new Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      this.filters.bloomPass.strength = 1.2;
      this.filters.bloomPass.radius = 1;
      this.filters.bloomPass.threshold = 0.1;

      this.Graph.scene().background = new Color(0x000000);
      new CubeTextureLoader().load(this.ldrUrls, bg => {
        this.Graph.scene().background = bg;
      });

      this.Graph.postProcessingComposer().addPass(this.filters.bloomPass);
    }
  }
};
</script>

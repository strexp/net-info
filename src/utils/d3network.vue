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
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { Color, Vector2 } from "three/build/three.min.js";

export default {
  props: ["nodeList", "linkList", "selected"],
  watch: {
    nodeList() {
      this.genView();
    },
    linkList() {
      this.genView();
    },
    selected() {
      this.highlightNodes.clear();
      if (this.selected) {
        this.highlightNodes.add(this.selected);
        this.selected.peers.forEach(neighbor =>
          this.highlightNodes.add(neighbor)
        );
      }
      this.refreshGraph();
    }
  },
  data: () => ({
    Graph: null,
    highlightNodes: null,
    stats: new Stats(),
    filters: {
      bloomPass: null,
      fxaaPass: null
    }
  }),
  mounted() {
    Bus.$on("Search", payload => {
      this.selected = this.nodeList.find(n => n.asn === payload);
    });
    Bus.$on("Focus", () => {
      this.focusSelect();
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
    focusSelect() {
      this.Graph.cameraPosition(
        {
          x: this.selected.x * 2,
          y: this.selected.y * 2,
          z: this.selected.z * 2
        }, // new position
        this.selected, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    },
    genView: function() {
      this.highlightNodes = new Set();
      this.Graph = ForceGraph3D();
      this.Graph(document.getElementById("container"))
        .graphData({
          nodes: this.nodeList,
          links: this.linkList
        })
        .nodeOpacity(1)
        .enableNavigationControls(true)
        .nodeRelSize(1)
        .backgroundColor("#000000")
        .onEngineTick(() => {
          this.stats.end();
          this.stats.begin();
        })
        .nodeThreeObject(node => {
          const sprite = new SpriteText(node.name);
          sprite.material.depthWrite = false;
          sprite.color = "#ffffff";
          sprite.textHeight = node.size;
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
        })
        .nodeThreeObjectExtend(true)
        .nodeColor(node =>
          this.highlightNodes.has(node)
            ? node === this.selected
              ? "rgba(0,255,255," + node.val / 10 + ")"
              : "rgba(255,150,0," + node.val / 20 + ")"
            : "rgba(255,255,255," + node.val / 50 + ")"
        )
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

      this.filters.bloomPass = new UnrealBloomPass(
        new Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      this.filters.fxaaPass = new ShaderPass(FXAAShader);

      var container = document.getElementById("container");
      const pixelRatio = this.Graph.renderer().getPixelRatio();
      this.filters.fxaaPass.material.uniforms["resolution"].value.x =
        1 / (container.offsetWidth * pixelRatio);
      this.filters.fxaaPass.material.uniforms["resolution"].value.y =
        1 / (container.offsetHeight * pixelRatio);

      this.filters.bloomPass.strength = 0.5;
      this.filters.bloomPass.radius = 0.7;
      this.filters.bloomPass.threshold = 0.001;

      this.Graph.postProcessingComposer().addPass(this.filters.bloomPass);
      this.Graph.postProcessingComposer().addPass(this.filters.fxaaPass);
      this.Graph.scene().background = new Color(0x000000);
    }
  }
};
</script>

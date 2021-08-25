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
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import {
  Object3D,
  Color,
  Vector2,
  CubeTextureLoader
} from "three/build/three.min.js";

export default {
  props: ["nodeList", "linkList", "selected"],
  watch: {
    nodeList() {
      if (!this.Graph) this.genView();
    },
    // linkList() {
    //   if (!this.Graph) this.genView();
    // },
    showBg(val) {
      if (!val) this.Graph.scene().background = new Color(0x000000);
      else
        new CubeTextureLoader().load(this.ldrUrls, bg => {
          this.Graph.scene().background = bg;
        });
    },
    showBlur(val) {
      if (!val) {
        this.Graph.postProcessingComposer().removePass(this.filters.bokehPass);
        this.filters.bokehPass = null;
      } else {
        if (this.filters.bokehPass)
          this.Graph.postProcessingComposer().removePass(
            this.filters.bokehPass
          );
        else
          this.filters.bokehPass = new BokehPass(
            this.Graph.scene(),
            this.Graph.camera(),
            {
              focus: 1000.0,
              aperture: 0.0003,
              maxblur: 0.01,
              width: window.innerWidth,
              height: window.innerHeight
            }
          );
        this.Graph.postProcessingComposer().addPass(this.filters.bokehPass);
      }
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
    showBg: true,
    showGlow: true,
    showText: true,
    showBlur: false,
    ldrUrls: [
      "/static/skybox/right.png",
      "/static/skybox/left.png",
      "/static/skybox/top.png",
      "/static/skybox/bottom.png",
      "/static/skybox/front.png",
      "/static/skybox/back.png"
    ],
    filters: {
      bloomPass: null,
      fxaaPass: null,
      cubeTexturePass: null,
      bokehPass: null
    }
  }),
  mounted() {
    Bus.$on("Search", payload => {
      var selectedNode = this.nodeList.find(n => n.asn === payload);
      if (selectedNode) this.updateSelected(selectedNode);
    });
    Bus.$on("Focus", () => {
      this.focusSelect();
    });
    Bus.$on("SwitchHop2", value => {
      this.selected = null;
      this.showHop2 = value;
    });
    Bus.$on("SwitchBg", value => {
      this.showBg = value;
    });
    Bus.$on("SwitchGlow", value => {
      this.showGlow = value;
    });
    Bus.$on("SwitchText", value => {
      this.showText = value;
    });
    Bus.$on("SwitchBlur", value => {
      this.showBlur = value;
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
      if (val !== null) {
        if (this.filters.bokehPass)
          this.filters.bokehPass.uniforms.focus.value = this.Graph.camera().position.distanceTo(
            val.__threeObj.position
          );
      }
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
      this.Graph = ForceGraph3D({ antialias: true, alpha: true });
      this.Graph(document.getElementById("container"))
        .graphData({
          nodes: this.nodeList,
          links: this.linkList
        })
        .nodeOpacity(1)
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
          if (!this.selected) return "rgba(255,255,255,0.4)";
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

      this.filters.bloomPass = new UnrealBloomPass(
        new Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      this.filters.fxaaPass = new ShaderPass(FXAAShader);

      // this.filters.bokehPass = new BokehPass(
      //   this.Graph.scene(),
      //   this.Graph.camera(),
      //   {
      //     focus: 1000.0,
      //     aperture: 0.0003,
      //     maxblur: 0.01,
      //     width: window.innerWidth,
      //     height: window.innerHeight
      //   }
      // );

      var container = document.getElementById("container");
      const pixelRatio = this.Graph.renderer().getPixelRatio();
      this.filters.fxaaPass.material.uniforms["resolution"].value.x =
        1 / (container.offsetWidth * pixelRatio);
      this.filters.fxaaPass.material.uniforms["resolution"].value.y =
        1 / (container.offsetHeight * pixelRatio);

      this.filters.bloomPass.strength = 1.2;
      this.filters.bloomPass.radius = 1;
      this.filters.bloomPass.threshold = 0.1;

      this.Graph.scene().background = new Color(0x000000);
      new CubeTextureLoader().load(this.ldrUrls, bg => {
        this.Graph.scene().background = bg;
      });

      this.Graph.postProcessingComposer().addPass(this.filters.bloomPass);
      this.Graph.postProcessingComposer().addPass(this.filters.fxaaPass);
    }
  }
};
</script>

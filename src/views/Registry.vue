<template>
  <div class="registry">
    <RegistryMap
      :prefixes="prefixes"
      :meta="meta"
      v-if="prefixes != null && meta != null"
    />
  </div>
</template>

<script>
import RegistryMap from "@/components/Registry/RegistryMap";

export default {
  data: () => ({
    prefixes: null,
    meta: null
  }),
  mounted() {
    var proto = this.$route.params.proto == "6" ? "6" : "4";
    this.$ajax
      .get(
        process.env.VUE_APP_DATA_URL +
          "/registry/prefix." +
          proto +
          ".json?time=1"
      )
      .then(response => {
        this.prefixes = response.data;
        if (proto == "4")
          this.prefixes.size = Math.pow(2, 32 - 14) + Math.pow(2, 32 - 16);
        if (proto == "6") {
          this.prefixes.children[0].size = Math.pow(2, 128 - 32);
          this.prefixes.size = this.prefixes.children[0].size;
        }
      });
    this.$ajax
      .get(
        process.env.VUE_APP_DATA_URL +
          "/registry/meta." +
          proto +
          ".json?time=1"
      )
      .then(response => {
        this.meta = response.data;
      });
  },
  components: {
    RegistryMap
  }
};
</script>

<style scoped>
.registry {
  max-width: 100%;
  overflow: hidden;
  position: fixed;
}
</style>

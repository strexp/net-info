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
    this.$ajax
      .get(process.env.VUE_APP_API_URL + "/kioubit/prefixes.json")
      .then(response => {
        this.prefixes = response.data;
      });
    this.$ajax
      .get(process.env.VUE_APP_API_URL + "/kioubit/meta.json")
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

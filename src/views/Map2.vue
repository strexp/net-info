<template>
  <div class="map">
    <MapRender
      class="map-render"
      :d="2"
      :proto="$route.params.proto == '6' ? 'ipv6' : 'ipv4'"
    />
  </div>
</template>

<script>
import MapRender from "@/components/Map/MapRender";

export default {
  components: {
    MapRender
  }
};
</script>

<style scoped>
.map {
  max-width: 100%;
  overflow: hidden;
  position: fixed;
}
</style>

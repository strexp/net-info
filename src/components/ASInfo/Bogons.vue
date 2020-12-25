<template>
  <v-alert
    color="warning"
    icon="mdi-alert"
    dark
    elevation="2"
    prominent
    v-if="bogon"
  >
    <v-row align="center" no-gutters>
      <v-col class="grow"> AS{{ asn }} announces bogons. </v-col>
      <v-col class="shrink">
        <v-btn text>Know More</v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  data: () => ({
    bogon: false,
  }),
  props: ["asn"],
  mounted() {
    this.$ajax
      .get(process.env.VUE_APP_API_URL + "/alerts.json")
      .then((response) => {
        response.data.roa_data.forEach((alt) => {
          if (this.asn.includes(alt.asn)) {
            this.bogon = true;
          }
        });
      });
  },
};
</script>

<style></style>

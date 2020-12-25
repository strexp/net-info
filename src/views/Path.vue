<template>
  <div>
    <v-card>
      <v-card-title>Pathfinder</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="from" label="ASN" outlined></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="to"
                label="to ASN (Optional)"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="search">Search!</v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mt-6" v-if="show">
      <v-card-text>
        <v-img :src="dir" max-height="80vh" contain />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    from: null,
    to: null,
    dir: null,
    show: false,
  }),
  mounted() {
    if ("fromasn" in this.$route.params) {
      this.from = this.$route.params.fromasn;
      if ("toasn" in this.$route.params) this.to = this.$route.params.toasn;
      this.search();
    }
  },
  methods: {
    search() {
      this.show = true;
      if (this.to)
        this.dir =
          process.env.VUE_APP_API_URL +
          "/path_lookup/" +
          this.from +
          "/" +
          this.to;
      else this.dir = process.env.VUE_APP_API_URL + "/as_graph/" + this.from;
    },
  },
};
</script>

<style></style>

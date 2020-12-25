<template>
  <div>
    <div>
      <v-card v-if="loading">
        <v-skeleton-loader class="mb-4 pa-4 pb-0" type="article,actions" />
      </v-card>
    </div>
    <div v-if="!loading">
      <v-card class="mb-4 pa-4 pb-0">
        <v-card-title class="text-h3">
          {{ asdata.asn["as-name"][0] }}
        </v-card-title>
        <v-card-subtitle class="text-h5">
          {{ asdata.asn["aut-num"][0] }}
        </v-card-subtitle>
        <v-card-actions>
          <v-btn :to="'/path/' + asdata.asn['aut-num'][0]" text>BGP Map</v-btn>
          <v-spacer />
          <span class="grey--text">Last Updated: {{ asdata.created }}</span>
        </v-card-actions>
      </v-card>

      <Bogons :asn="asdata.asn['aut-num'][0]" />

      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-card class="mr-md-2 my-2">
            <v-card-title>Description</v-card-title>
            <v-card-subtitle>"descr" in aut-num file</v-card-subtitle>
            <v-card-text>
              <pre v-html="descr"></pre>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="ml-md-2 my-2">
            <v-card-title>Routes</v-card-title>
            <v-card-subtitle
              >Route information from "route" files.</v-card-subtitle
            >
            <Routes
              :routes="[].concat(asdata.routes.ipv4, asdata.routes.ipv6)"
            />
          </v-card>
          <v-card class="ml-md-2 my-2">
            <v-card-title>Contacts</v-card-title>
            <v-card-subtitle
              >Contact information from mnt file.</v-card-subtitle
            >
            <Contact :contact="asdata.asn['contact-info']" />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Routes from "@/components/ASInfo/Routes";
import Bogons from "@/components/ASInfo/Bogons";
import Contact from "@/components/ASInfo/Contact";

export default {
  data: () => ({
    loading: true,
    bogon: false,
    asdata: {
      asn: {
        "contact-info": {},
      },
      routes: {
        ipv4: [],
        ipv6: [],
      },
    },
  }),
  components: { Routes, Contact, Bogons },
  watch: {
    $route() {
      this.mounted();
    },
  },
  computed: {
    descr() {
      if (this.asdata.asn == {}) return "";
      if (!("remarks" in this.asdata.asn)) return "";
      var ret = "";
      this.asdata.asn.remarks.forEach((ln) => {
        ret = ret + ln.trim() + "</br>";
      });
      return ret;
    },
  },
  mounted() {
    this.$ajax
      .get(
        process.env.VUE_APP_API_URL +
          "/as/AS" +
          this.$route.params.asn +
          ".json"
      )
      .then((response) => {
        this.asdata = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.$router.push("/404");
      });
  },
};
</script>

<style lang="scss" scoped>
pre {
  overflow-x: auto;
}
</style>

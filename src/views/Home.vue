<template>
  <div class="home">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Welcome to Strategic Explorations BGP Info Service.</v-card-title>
          <v-card-subtitle>This system is operated by Network Research Center of Niantic Project China.</v-card-subtitle>
          <v-card-actions>
            <v-btn href="https://strexp.net" text color="primary">
              <v-icon left>mdi-home</v-icon>HomePage
            </v-btn>
            <v-spacer />
            <v-btn href="https://github.com/strexp/net-info" text color="grey">
              <v-icon left>mdi-github</v-icon>Code
            </v-btn>
            <v-btn href="mailto:dn42@strexp.net" text color="grey">
              <v-icon left>mdi-email</v-icon>Contact
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3" v-for="i in info.data" :key="i.id">
        <InfoCard :title="i.title" :num="i.cnt" :color="i.color" :descr="i.desc" :icon="i.icon" />
      </v-col>
      <v-col cols="12" md="6">
        <SelfIP />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import InfoCard from "@/components/Home/InfoCard";
import SelfIP from "@/components/Home/SelfIP";

export default {
  name: "Home",
  data: () => ({
    info: []
  }),
  components: {
    InfoCard,
    SelfIP
  },
  mounted() {
    this.$ajax.get(process.env.VUE_APP_API_URL + "/summary.json").then(response => {
      this.info = response.data;
    });
  }
};
</script>

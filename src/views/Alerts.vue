<template>
  <div>
    <v-alert
      color="warning"
      dark
      icon="mdi-information"
      prominent
      elevation="2"
    >
      <div class="title">
        The following alerts is for reference only.
      </div>
      All data comes from the statistics of Niantic Network (AS4242421331) on
      NYC1 node, which cannot be guaranteed to be accurate and comprehensive.
    </v-alert>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card class="mr-md-2 my-2">
          <v-card-title
            ><v-icon left>mdi-alert</v-icon>IPv4 ROA Errors</v-card-title
          >
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  ASN
                </th>
                <th class="text-left">
                  Prefix
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alt in alerts.ipv4" :key="alt.prefix">
                <td @click="$router.push('/ASInfo/' + alt.asn)">
                  {{ alt.name }} <br />
                  <span class="grey--text">{{ alt.asn }}</span>
                </td>
                <td>{{ alt.prefix }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="ml-md-2 my-2">
          <v-card-title
            ><v-icon left>mdi-alert</v-icon>IPv6 ROA Errors</v-card-title
          >
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  ASN
                </th>
                <th class="text-left">
                  Prefix
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alt in alerts.ipv6" :key="alt.prefix">
                <td @click="$router.push('/ASInfo/' + alt.asn)">
                  {{ alt.name }}
                  <br />
                  <span class="grey--text">{{ alt.asn }}</span>
                </td>
                <td>{{ alt.prefix }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    alerts: {
      ipv4: [],
      ipv6: []
    },
    loading: true
  }),
  mounted() {
    this.$ajax
      .get(
        process.env.VUE_APP_API_URL +
          "/alerts.json?rnd=" +
          Math.floor(Date.now() / 600000)
      )
      .then(response => {
        response.data.roa_data.forEach(alt => {
          if (
            alt.prefix.match(
              /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/
            )
          ) {
            this.alerts.ipv4.push(alt);
          } else {
            this.alerts.ipv6.push(alt);
          }
        });
        this.loading = false;
      });
  }
};
</script>

<style></style>

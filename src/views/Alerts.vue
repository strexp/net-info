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
      All data comes from the statistics of Global Route Collector (GRC) of
      burble.dn42, which cannot be guaranteed to be fully accurate.
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
                <td @click="selectAlert(alt)">{{ alt.prefix }}</td>
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
                <td @click="selectAlert(alt)">{{ alt.prefix }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>ROA Violation Info</v-card-title>
        <v-divider />
        <v-card-text class="mt-4">
          <p>
            <v-icon left>mdi-network</v-icon>Network:
            <code>{{ selected_alert.name }} ({{ selected_alert.asn }})</code>
            <v-btn :to="'/ASInfo/' + selected_alert.asn" icon
              ><v-icon>mdi-information</v-icon></v-btn
            >
          </p>
          <p>
            <v-icon left>mdi-ip</v-icon>Prefix:
            <code>{{ selected_alert.prefix }}</code>
          </p>
          <p>
            <v-icon left>mdi-router-network</v-icon>AS Path:
            <v-chip
              :to="'/ASInfo/' + path"
              small
              label
              v-for="path in selected_alert.aspath"
              :key="path"
              class="mx-1 "
              >{{ path }}</v-chip
            >
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    alerts: {
      ipv4: [],
      ipv6: []
    },
    loading: true,
    dialog: false,
    selected_alert: {}
  }),
  methods: {
    selectAlert(it) {
      this.selected_alert = it;
      this.dialog = true;
    }
  },
  mounted() {
    this.$ajax
      .get(
        process.env.VUE_APP_DATA_URL +
          "/roa/alerts.json?rnd=" +
          Math.floor(Date.now() / 600000)
      )
      .then(response => {
        this.alerts.ipv4 = response.data.roa4_data;
        this.alerts.ipv6 = response.data.roa6_data;
        this.loading = false;
      });
  }
};
</script>

<style></style>

<template>
  <div>
    <v-skeleton-loader v-if="loading" />
    <v-card v-if="!loading">
      <v-card-title>
        <v-icon left>mdi-ip-network</v-icon>
        Your IP</v-card-title
      >
      <v-card-subtitle>Your IP address in DN42 network.</v-card-subtitle>
      <v-card-text>
        <v-list two-line>
          <v-list-item>
            <v-list-item-avatar color="primary">
              <v-icon dark>
                mdi-network-outline
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ ipinfo.addr }}</v-list-item-title>
              <v-list-item-subtitle>Your IP address.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <!-- <v-divider />
          <v-list-item>
            <v-list-item-avatar color="primary">
              <v-icon dark>
                mdi-network-outline
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ ipinfo.asn }}</v-list-item-title>
              <v-list-item-subtitle>Your ASN.</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon>mdi-message-text</v-icon>
            </v-list-item-icon>
          </v-list-item> -->
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    ipinfo: null,
    loading: true
  }),
  mounted() {
    this.$ajax.get(process.env.VUE_APP_API_URL + "/myip").then(response => {
      this.ipinfo = response.data;
      this.loading = false;
    });
  }
};
</script>

<style></style>

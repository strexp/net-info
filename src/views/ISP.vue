<template>
  <div>
    <v-alert color="info" dark icon="mdi-information" prominent elevation="2">
      <div class="title">
        The following classification is for reference only.
      </div>
      Betweenness centrality is used to calculate the ISP level. It represents
      the degree of interaction between a node and other nodes. A node with
      higher betweenness centrality has stronger control ability in the network,
      because more information will pass through the node when it is
      transmitted.
    </v-alert>
    <v-expansion-panels class="my-4" v-for="g in operator_groups" :key="g.name">
      <v-expansion-panel>
        <v-expansion-panel-header class="py-0">
          <v-card-text class="pa-0">
            <v-card-title>
              {{ g.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ g.desc }}
            </v-card-subtitle>
          </v-card-text>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list two-line>
            <v-list-item
              @click="
                {
                }
              "
              v-for="o in g.data"
              :key="o.asn"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ o.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ o.asn }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-row>
                  <v-btn :to="'/path/' + o.asn" icon>
                    <v-icon color="grey">mdi-graph</v-icon>
                  </v-btn>
                  <v-btn icon :to="'/asinfo/' + o.asn">
                    <v-icon color="grey">mdi-information</v-icon>
                  </v-btn>
                </v-row>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  data: () => ({
    operator_groups: null,
    loading: true
  }),
  mounted() {
    this.$ajax
      .get(
        process.env.VUE_APP_API_URL +
          "/isp.json?rnd=" +
          Math.floor(Date.now() / 600000)
      )
      .then(response => {
        this.operator_groups = response.data;
        this.loading = false;
      });
  }
};
</script>

<style></style>

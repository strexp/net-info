<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    clearable
    hide-details
    hide-selected
    cache-items
    solo
    item-text="name"
    item-value="asn"
    flat
    solo-inverted
    prepend-inner-icon="mdi-magnify"
    label="Search for a network..."
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          Search for a
          <strong>DN42 Network</strong>
        </v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-avatar
        color="indigo"
        class="headline font-weight-light white--text"
      >
        {{ item.name.charAt(0) }}
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="item.name"></v-list-item-title>
        <v-list-item-subtitle v-text="item.asn"></v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-icon>mdi-network</v-icon>
      </v-list-item-action>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  data: () => ({
    isLoading: false,
    items: [],
    model: null,
    search: null,
  }),

  watch: {
    model() {
      if (this.model) this.$router.push("/asInfo/" + this.model);
    },
    search() {
      // Items have already been loaded
      if (this.items.length > 0) return;

      this.isLoading = true;

      // Lazily load input items
      fetch(process.env.VUE_APP_API_URL + "/isp.json")
        .then((res) => res.clone().json())
        .then((res) => {
          this.items = [];
          res.forEach((group) => {
            this.items = this.items.concat(group.data);
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style></style>

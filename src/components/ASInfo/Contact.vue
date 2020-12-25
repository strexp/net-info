<template>
  <v-list>
    <v-list-item>
      <v-list-item-avatar color="primary"
        ><v-icon dark>mdi-account</v-icon></v-list-item-avatar
      >
      <v-list-item-content>
        <v-list-item-title>{{
          "person" in contact ? contact["person"][0] : "Unknown Person"
        }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ getContact(contact) }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="'pgp-fingerprint' in contact">
        <v-icon>mdi-lock</v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: ["contact"],
  methods: {
    getContact(contact) {
      if ("e-mail" in contact) return contact["e-mail"][0];
      if ("contact" in contact) return contact["contact"][0];
      return "Unknown Contact";
    },
  },
};
</script>

<style></style>

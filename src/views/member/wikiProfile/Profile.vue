<template>
  <v-card class="mt-12 boxShadow pa-5">
    <v-tabs fixed-tabs v-model="tabs">
      <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <!-- wiki -->
      <v-tab-item>
        <profile-wiki-editing v-bind:parent="member" />
      </v-tab-item>

      <!-- wiki -->
      <v-tab-item>
        <profile-wiki-edited v-bind:parent="member" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import ProfileWikiEditing from "./ProfileWikiEditing.vue";
import ProfileWikiEdited from "./ProfileWikiEdited.vue";
export default {
  components: {
    ProfileWikiEditing,
    ProfileWikiEdited
  },

  data() {
    return {
      tabs: null,
      member: {},
      tabItems: ["Editing Wiki", "Editied Wiki"],
    };
  },

  created() {
    this.member = this.$store.state.member;
  },
};
</script>
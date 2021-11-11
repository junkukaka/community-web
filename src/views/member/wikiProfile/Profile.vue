<template>
  <v-card class="mt-12 boxShadow pa-5">
    <v-tabs fixed-tabs v-model="tabs">
      <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <!-- wiki editing-->
      <v-tab-item>
        <profile-wiki-editing v-bind:parent="member" />
      </v-tab-item>

      <!-- wiki edited-->
      <v-tab-item>
        <profile-wiki-edited v-bind:parent="member" />
      </v-tab-item>

      <!-- wiki like-->
      <v-tab-item>
        <profile-wiki-likes v-bind:parent="member" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import ProfileWikiEditing from "./ProfileWikiEditing.vue";
import ProfileWikiEdited from "./ProfileWikiEdited.vue";
import ProfileWikiLikes from "./ProfileWikiLikes.vue";
export default {
  components: {
    ProfileWikiEditing,
    ProfileWikiEdited,
    ProfileWikiLikes
  },

  data() {
    return {
      tabs: null,
      member: {},
      tabItems: ["Editing Wiki", "Editied Wiki","Wiki like"],
    };
  },

  created() {
    this.member = this.$store.state.member;
  },
};
</script>
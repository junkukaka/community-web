<template>
  <v-card flat>
    <v-tabs fixed-tabs v-model="tabs">
      <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <!-- community -->
      <v-tab-item>
        <profile-community v-bind:parent="member" />
      </v-tab-item>

      <!-- comment -->
      <v-tab-item>
        <profile-comment v-bind:parent="member" />
      </v-tab-item>

      <!-- liks -->
      <v-tab-item>
        <profile-likes v-bind:parent="member" />
      </v-tab-item>

      <!-- collect -->
      <v-tab-item>
        <profile-collect v-bind:parent="member" />
      </v-tab-item>

      <!-- wiki -->
      <v-tab-item>
        <profile-wiki v-bind:parent="member" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import ProfileCollect from "./ProfileCollect.vue";
import ProfileComment from "./ProfileComment.vue";
import ProfileCommunity from "./ProfileCommunity.vue";
import ProfileLikes from "./ProfileLikes.vue";
import ProfileWiki from "./ProfileWiki.vue";
export default {
  components: {
    ProfileCommunity,
    ProfileComment,
    ProfileLikes,
    ProfileCollect,
    ProfileWiki,
  },

  data() {
    return {
      tabs: null,
      member: {},
      tabItems: ["community", "comment", "liks", "Collection", "wiki"],
    };
  },

  created() {
    this.member = this.$store.state.member;
  },
};
</script>
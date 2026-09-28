<template>
  <v-card class="mt-12 boxShadow pa-5">
    <v-tabs fixed-tabs v-model="tabs" color="indigo">
      <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
      </v-tab>
    </v-tabs>

    <v-window v-model="tabs">
      <!-- community -->
      <v-window-item>
        <profile-community v-bind:parent="member" />
      </v-window-item>

      <!-- comment -->
      <v-window-item>
        <profile-comment v-bind:parent="member" />
      </v-window-item>

      <!-- liks -->
      <v-window-item>
        <profile-likes v-bind:parent="member" />
      </v-window-item>

      <!-- collect -->
      <v-window-item>
        <profile-collect v-bind:parent="member" />
      </v-window-item>

    </v-window>
  </v-card>
</template>
<script>
import ProfileCollect from "./ProfileCollect.vue";
import ProfileComment from "./ProfileComment.vue";
import ProfileCommunity from "./ProfileCommunity.vue";
import ProfileLikes from "./ProfileLikes.vue";
export default {
  components: {
    ProfileCommunity,
    ProfileComment,
    ProfileLikes,
    ProfileCollect,
  },

  data() {
    return {
      tabs: null,
      member: {},

    };
  },

  computed: {
    tabItems(){
      return [this.$t('community'), this.$t('comments'), this.$t('likes'), this.$t('collect')]
    }
  },

  created() {
    this.member = this.$store.state.member;
  },
};
</script>
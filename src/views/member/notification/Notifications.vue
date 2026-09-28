<template>
  <v-card flat class="mt-12 boxShadow pa-5">
    <v-tabs fixed-tabs v-model="tabs">
      <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
      </v-tab>
    </v-tabs>

    <v-window v-model="tabs">
      <!-- community -->
      <v-window-item>
        <comment v-bind:parent="member" />
      </v-window-item>

    </v-window>
  </v-card>
</template>
<script>
import Comment from "./Comment.vue";
export default {
  components: {
    Comment,
  },

  data() {
    return {
      tabs: null,
      member: {},
      tabItems: ["community notification"],
    };
  },

  created() {
    this.member = this.$store.state.member;
  },
};
</script>
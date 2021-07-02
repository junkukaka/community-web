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
        <comment v-bind:parent="member" />
      </v-tab-item>

    </v-tabs-items>
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
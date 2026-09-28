<template>
  <v-card flat>
    <v-tabs fixed-tabs v-model="tabs">
      <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tabs">
       <v-window-item>
        <authority-manage />
      </v-window-item>
      <v-window-item>
        <department />
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script>
import AuthorityManage from "./AuthorityManage";
import Department from "./Department";

export default {
  components: {
    Department,
    AuthorityManage,
  },

  data() {
    return {
      tabs: null,
      tabItems: ["권한관리", "Department"],
    };
  },

  methods: {
    checkAdmin() {
      if (this.member.authority != 0) {
        this.$router.push("/");
      }
    },
  },
};
</script>
<template>
  <v-card flat>
    <v-toolbar flat>
      <template v-slot:extension>
        <v-tabs fixed-tabs v-model="tabs">
          <v-tab v-for="itme in tabItems" :key="itme">
            {{ itme }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tabs">
      
      
      <!-- member list -->
      <v-tab-item>
        <admin-member-list/>
      </v-tab-item>


    </v-tabs-items>
  </v-card>
</template>
<script>
import AdminMemberList from './AdminMemberList.vue';

export default {
  components:{
    AdminMemberList,
  },

  data() {
    return {
      tabs: null,
      member:{},
      tabItems: ["member"],
    };
  },

  created(){
    this.member = this.$store.state.member;
  }

};
</script>
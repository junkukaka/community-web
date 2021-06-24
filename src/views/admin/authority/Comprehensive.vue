<template>
  <v-card flat>
    <v-tabs fixed-tabs v-model="tabs">
        <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
        </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <authority-manage/>
      </v-tab-item>  

       <v-tab-item>
        <department/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import AuthorityManage from './AuthorityManage';
import Department from './Department';

export default {
  components:{
    Department,
    AuthorityManage,
  },

  data() {
    return {
      tabs: null,
      tabItems: ["Department", "권한관리"],
    };
  },

  

  methods: {
    checkAdmin(){
        if(this.member.authority != 0) {
            this.$router.push("/");
        }
    }  
  }  


  
};
</script>
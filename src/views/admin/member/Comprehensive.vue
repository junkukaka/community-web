<template>
  <v-card flat>
    <v-tabs fixed-tabs v-model="tabs">
        <v-tab v-for="itme in tabItems" :key="itme">
        {{ itme }}
        </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <!-- member list -->
      <v-tab-item>
        <member-list/>
      </v-tab-item>

       <!-- member application -->
      <v-tab-item>
        <application-member/>
      </v-tab-item>  
    </v-tabs-items>
  </v-card>
</template>
<script>
import ApplicationMember from './ApplicationMember.vue';
import MemberList from './MemberList.vue';

export default {
  components:{
    MemberList,
    ApplicationMember
  },

  data() {
    return {
      tabs: null,
      tabItems: ["회원 리스트", "신청 회원"],
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
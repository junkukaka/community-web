<template>
  <v-app-bar
    app
    fixed
    flat
    elevate-on-scroll
    elevation = 0
    class="white"
    style="border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important"
  > 
    <v-card flat to="/" class="pr-3 pl-3">
      <v-btn color="indigo" class="mt-2" outlined>
        Home
        <v-icon
          right
          dark
        >
          mdi-home
        </v-icon>
      </v-btn>
    </v-card>
    <v-card flat  clas="pa-0 ma-0">
      <v-tabs>
        <v-tab  @click="toLink(1)">
           <span class="black--text pl-3 pr-3 pl-3 pr-3">회원 관리</span>
        </v-tab>
        <v-tab @click="toLink(2)">
           <span class="black--text pl-3 pr-3 pl-3 pr-3">권한 관리</span>
        </v-tab>
        <v-tab @click="toLink(3)">
           <span class="black--text pl-3 pr-3 pl-3 pr-3">커뮤니티 메뉴</span>
        </v-tab>
        <v-tab  @click="toLink(4)">
           <span class="black--text pl-3 pr-3 pl-3 pr-3">위키 메뉴</span>
        </v-tab>
        <v-tab  @click="toLink(5)">
           <span class="black--text pl-3 pr-3 pl-3 pr-3">커뮤니티 관리</span>
        </v-tab>
        <v-tab  @click="toLink(6)">
           <span class="black--text pl-3 pr-3 pl-3 pr-3">위키 관리</span>
        </v-tab>
      </v-tabs>
    </v-card>
   
  </v-app-bar>
</template>

<script>

export default {
  data: () => ({
  }),

  created() {
    this.member = this.$store.state.member;
    this.checkAdmin();
  },

  methods: {
    checkAdmin() {
      if (this.member.authority != 0) {
        this.$router.push("/");
      }
    },

    toLink(toLink) {
      switch (toLink) {
        case 1:
          this.$router.push(`/aspnAdmin/memberComprehensive`);
          break;
        case 2:
          this.$router.push(`/aspnAdmin/authorityComprehensive`);
          break;  
        case 3:
          this.$router.push(`/aspnAdmin/communityMenu`);
          break;
        case 4:
          this.$router.push(`/aspnAdmin/wikiMenu`);
          break;
        case 5:
          this.$router.push(`/aspnAdmin/communityManage`);
          break;  
        case 6:
          this.$router.push(`/aspnAdmin/wikiManage`);
          break;    
      }
    },

   

  },
};
</script>



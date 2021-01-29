<template>
    <v-card flat>
        <v-text-field
            label="제목"
            hint="www.example.com/page"
            persistent-hint
            outlined
            style="border-radius:0"
            v-model="community.title"
          ></v-text-field>
        <vue-editor v-model="community.content"/>

         <v-btn
            large
            depressed
            color="primary"
            class="ma-2 white--text float-sm-right"
            @click="insert"
            >
            등록
            <v-icon
                right
                dark
            >
                mdi-pencil
            </v-icon>
            </v-btn>

    </v-card>
  
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor },

  data: () => ({
    community: {
      id:'',
      userId: 1,
      menuId: null,
      title: "제목",
      content: "내용"
    }
  }),

  created: function(){
    this.community.menuId = this.$route.query.menuId;
  },

  methods: {
      //增加内容
      insert: function(){
        let router = this.$router;
        let data = this.community
        this.$nextTick(function(){
          this.$http.post("/community/communitys",data)
            .then(function(response){
              router.push("/communityList?menuId="+ data.menuId);
            });
        });
      }
      
  }
};
</script>

<style lang="stylus">

</style>
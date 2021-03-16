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

        <vue-editor id="Editor"
          v-model.lazy="community.content">
        </vue-editor>

         <v-btn
            large
            depressed
            color="primary"
            class="ma-2 white--text float-sm-right"
            @click="save"
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
import { VueEditor, Quill } from "vue2-editor";
export default {
  components: { VueEditor, Quill  },

  data: () => ({
    community: {
      id: null,
      memberId: null,
      menuId: null,
      title: "제목",
      content: "내용"
    },

  }),

  created: function(){
    this.community.menuId = this.$route.query.menuId;
    this.community.memberId = this.$store.state.user.id;
    this.community.id = this.$route.query.id;
    if(this.community.id != null){
      this.initialize();
    }
  },

  methods: {

    //初始化
    initialize: function(){
      let data = this.$data
      this.$nextTick(function(){
        this.$http.get(`/community/communitys/${data.community.id}`)
          .then(function(response){
            data.community = response.data.data
          })
      })
    },
    //增加内容
    save: function(){
      let router = this.$router;
      let data = this.community
      this.$nextTick(function(){
        this.$http.post("/community/communitys",data)
          .then(function(response){
            router.push(`/communityList?menuId=${data.menuId}`);
          });
      });
    },
  }
      
  
};
</script>

<style lang="stylus">


</style>
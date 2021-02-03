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
     
          useCustomImageHandler 
          @image-added="handleImageAdded"
        
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
      userId: 1,
      menuId: null,
      title: "제목",
      content: "내용"
    },

  }),

  created: function(){
    this.community.menuId = this.$route.query.menuId;
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
            router.push("/communityList?menuId="+ data.menuId);
          });
      });
    },

    //截图粘贴图片
    // chageEditor(){
    //   const reg = /data:image\/png\;base64\,[a-z,A-Z]([^'"]+)/g
    //   let data = this.$data
    //   const pngStr = data.community.content.match(reg) //pngStr[]
    //   if(pngStr != null){
    //     //图片转换成字符串
    //     const targetReplace = pngStr[0];
    //     //获取上传图片地址
    //     this.$nextTick(function(){
    //       this.$http.post("/minio/base64",{
    //         base64 : targetReplace
    //       }).then(function(response){
    //         data.tmpUrl = response.data.data
    //         console.log(`data.tmpUrl  : ${data.tmpUrl}`)
    //       })
    //     })
    //     console.log(`url : ${data.tmpUrl}`)
    //     //更换图片
    //     data.community.content = data.community.content.replace(targetReplace,data.tmpUrl)
    //     console.log(data.community.content)
    //   }
    // },

    //vue2Editor 文件上传
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)
      let formData = new FormData();
      formData.append("image", file);

      this.$http.post("/minio/upload",formData)
        .then(result => {
          console.log(result.data.data);
          let url = result.data.data; // Get url from response
          
          Editor.insertEmbed(cursorLocation, "image", url);
          resetUploader();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
      
  
};
</script>

<style lang="stylus">

</style>
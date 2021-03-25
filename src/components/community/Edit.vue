<template>
  <v-card flat>
    <v-text-field
      label="Title"
      hint="www.example.com/page"
      persistent-hint
      outlined
      style="border-radius: 0"
      v-model.lazy="community.title"
    ></v-text-field>

    <v-md-editor
      @upload-image="handleUploadImage"
      :disabled-menus="[]"
      @save="saveMdEditor"
      :include-level="[1,2,3,4]"
      left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol todo-list table hr | link image code | save | tip emoji "
      v-model="community.content"
      height="600px"
    >
    </v-md-editor>

    <!-- <div>
       <vue-editor v-model="community.content" />
    </div> -->

    <v-btn
      large
      depressed
      color="primary"
      class="ma-2 white--text float-sm-right"
      @click="save"
    >
      등록
      <v-icon right dark> mdi-content-save </v-icon>
    </v-btn>
  </v-card>
</template>

<script>
import { VueEditor, Quill } from "vue2-editor";
export default {
  components: { VueEditor, Quill },

  data: () => ({
    community: {
      id: null,
      memberId: null,
      menuId: null,
      title: "Title...",
      content: "",
    },
  }),

  created: function () {
    this.community.menuId = this.$route.query.menuId;
    this.community.memberId = this.$store.state.member.id;
    this.community.id = this.$route.query.id;
    if (this.community.id != null) {
      this.initialize();
    }
  },

  methods: {
    //初始化
    initialize: function () {
      let data = this.$data;
      this.$nextTick(function () {
        this.$http
          .get(`/community/communitys/${data.community.id}`)
          .then(function (response) {
            data.community = response.data.data;
          });
      });
    },
    //增加内容
    save: function () {
      let router = this.$router;
      let data = this.community;
      this.$nextTick(function () {
        this.$http.post("/community/communitys", data).then((response) => {
          router.go(-1);
        });
      });
    },

    saveMdEditor(){

    },

    // getBase64(file) {
    //   return new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => resolve(reader.result);
    //     reader.onerror = error => reject(error);
    //   });
    // },


    //v-md-edtor upload image
    handleUploadImage(event, insertImage, files) {
      // Get the files and upload them to the file server, then insert the corresponding content into the editor
      // debugger
      let formData = new FormData();
      formData.append("file", files[0]);
      let imgUrl = "";
      this.$nextTick(function () {
        this.$http.post("/minio/vue_md_Editor",formData)
          .then((response) => {
          console.log(response.data.data)
          imgUrl = response.data.data
          //添加图片
          insertImage({
            url: imgUrl,
            desc: 'desc',
            width: 'auto',
            height: 'auto',
          });
        });
      });  
 
      // Here is just an example
      
    },

  },
};
</script>

<style lang="stylus"></style>
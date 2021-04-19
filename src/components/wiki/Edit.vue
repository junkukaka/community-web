<template>
  <v-card flat>
    
    <v-row no-gutters>
        <v-col cols="12" sm="3" md="2" lg="1">
          <v-avatar size="62">
            <img :src="wiki.picture" />
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="9" md="10" lg="11" class="pl-2 pt-2">
          <v-file-input
            :rules="imgRules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an avatar"
            label="Avatar"
            v-model="wiki.picture"
            style="cursor: pointer;"
          ></v-file-input>
        </v-col>
    </v-row>

    <v-text-field
      label="Title"
      hint="this is wiki title area"
      persistent-hint
      outlined
      style="border-radius: 0"
      v-model.lazy="wiki.title"
    ></v-text-field>

    <v-md-editor
      @upload-image="handleUploadImage"
      :disabled-menus="[]"
      @save="saveMdEditor"
      :include-level="[1,2,3,4]"
      left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol todo-list table hr | link image code | save | tip emoji "
      v-model="wiki.content"
      height="600px"
    >
    </v-md-editor>

    <v-textarea
      class="mt-5"
      label="Wiki history Comment"
      outlined
      persistent-hint
      style="border-radius: 0"
      v-model.lazy="wiki.comment"
    ></v-textarea>

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
// import { VueEditor, Quill } from "vue2-editor";
export default {
  // components: { VueEditor, Quill },

  data: () => ({
    wiki: {
      id: null,
      memberId: null,
      menuId: null,
      title: "",
      picture: null,
      content: "",
      comment: ""
    },
    imgRules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!",
    ],
  }),

  created: function () {
    this.wiki.menuId = this.$route.query.menuId;
    this.wiki.memberId = this.$store.state.member.id;
    this.wiki.id = this.$route.query.id;
    // if (this.wiki.id != null) {
    //   this.initialize();
    // }
  },

  methods: {
    //初始化
    initialize: function () {
      this.$nextTick(function () {
        this.$http
          .get(`/wiki/wikis/${this.wiki.id}`)
          .then((response) => {
            this.wiki = response.data.data;
          });
      });
    },
    //增加内容
    save: function () {
      let router = this.$router;
      let data = this.community;
      this.$nextTick(function () {
        this.$http.post("/wiki/wikis", data).then((response) => {
          router.go(-1);
        });
      });
    },

    saveMdEditor(){

    },


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
          // console.log(response.data.data)
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
    },

  },
};
</script>
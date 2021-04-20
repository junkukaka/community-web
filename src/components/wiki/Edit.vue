<template>
  <v-card flat>
    <v-text-field
      label="Title"
      hint="this is wiki title area"
      persistent-hint
      outlined
      style="border-radius: 0"
      v-model.lazy="wikiHis.title"
    ></v-text-field>
    <v-row no-gutters>
        <v-col cols="12" sm="3" md="2" lg="1">
          <v-avatar size="62">
            <img :src="wikiHis.picture" />
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="9" md="10" lg="11" class="pl-2 pt-2">
          <v-file-input
            :rules="imgRules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an avatar"
            label="Avatar"
            v-model="avatar"
            style="cursor: pointer;"
          ></v-file-input>
        </v-col>
    </v-row>

    <v-md-editor
      @upload-image="handleUploadImage"
      :disabled-menus="[]"
      @save="saveMdEditor"
      :include-level="[1,2,3,4]"
      left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol todo-list table hr | link image code | save | tip emoji "
      v-model="wikiHis.content"
      height="600px"
    >
    </v-md-editor>

    <v-textarea
      class="mt-5"
      label="Wiki history Comment"
      outlined
      persistent-hint
      style="border-radius: 0"
      v-model.lazy="wikiHis.information"
    ></v-textarea>

    <v-btn
      large
      depressed
      block
      color="primary"
      class="mt-3 white--text"
      @click="save"
    >
      SAVE Content
      <v-icon right dark> mdi-content-save </v-icon>
    </v-btn>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    wikiHis: {
      id: null,
      wikiId: null,
      title: null,
      menuId: null,
      memberId: null,
      picture: null,
      content: "",
      information: "",
      active: true
    },
    avatar: null,
    imgRules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!",
    ],
  }),

   watch: {
    //图片上传
    avatar: {
      handler(newVal) {
        const formData = new FormData();
        formData.append("image", newVal);
        this.$http
          .post("/minio/user", formData)
          .then((result) => {
            this.wikiHis.picture = result.data.data;
          })
          .catch((e) => console.log(e));
      },
    },
  },

  created: function () {
    this.wikiHis.menuId = this.$route.query.menuId;
    this.wikiHis.memberId = this.$store.state.member.id;
    this.wikiHis.id = this.$route.query.id;
    if (this.wikiHis.id != null) {
      this.initialize();
    }
  },

  methods: {
    //初始化
    initialize: function () {
      this.$nextTick(function () {
        this.$http
          .get(`/wiki/wikis/${this.wikiHis.id}`)
          .then((response) => {
            this.wiki = response.data.data;
          });
      });
    },

    //增加内容
    save: function () {
      let router = this.$router;
      let data = this.wikiHis;
      this.$nextTick(function () {
        this.$http.post("/wiki/wikiHis", data).then((response) => {
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
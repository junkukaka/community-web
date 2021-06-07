<template>
  <v-card flat>
    <v-text-field
      label="Title"
      hint="this is wiki title area"
      persistent-hint
      outlined
      :rules="titleRules"
      style="border-radius: 0"
      v-model.lazy="wikiHis.title"
    ></v-text-field>
    <v-row no-gutters>
      <v-col cols="12" sm="3" md="2" lg="1">
        <v-avatar size="62" tile>
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
          style="cursor: pointer"
        ></v-file-input>
      </v-col>
    </v-row>

    <!-- undo redo clear | h bold italic strikethrough quote | ul ol todo-list table hr | link image code | save | tip emoji -->
    <v-md-editor
      @upload-image="handleUploadImage"
      :disabled-menus="[]"
      @save="saveDialog = true"
      :include-level="[1, 2, 3, 4]"
      left-toolbar="h bold italic strikethrough quote | ul ol todo-list table hr | link image code | tip emoji "
      v-model="wikiHis.content"
      height="600px"
    >
    </v-md-editor>

    <v-textarea
      class="mt-5"
      label="Wiki history Comment"
      outlined
      :rules="commentRules"
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
      @click="saveDialog = true"
    >
      SAVE Content
      <v-icon right dark> mdi-content-save </v-icon>
    </v-btn>

    <!-- save message dialog area -->
    <v-dialog v-model="saveDialog" max-width="290">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to publish ?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="saveDialog = false">
            cancle
          </v-btn>
          <v-btn color="green darken-1" text @click="wikiHis.active = false; save();"> save </v-btn>
          <v-btn color="primary darken-1" text @click="wikiHis.active = true; save();">
            Active
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- warning message dialog area -->
    <v-dialog v-model="warningDialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> Warning message </v-card-title>
        <v-card-subtitle>{{ warningMsg }}</v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="warningDialog = false">
            Get it
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      active: false,
      hisYn: 0
    },
    oldContent:"",
    memberId : null,
    avatar: null,
    imgRules: [
      (value) =>
        !value ||
        value.size < 10000000 ||
        "Avatar size should be less than 10 MB!",
    ],
    warningDialog: false,
    warningMsg: null,
    saveDialog: false,
    fromProfile: undefined,
    titleRules: [
      (v) => !!v || "title is required",
      (v) => (v && v.length <= 255) || "Name must be less than 255 characters",
    ],
    commentRules: [
      (v) => !!v || "title is required",
      (v) => (v && v.length <= 1000) || "Name must be less than 1000 characters",
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
    this.memberId = this.$store.state.member.id;
    this.wikiHis.id = this.$route.query.id;
    this.fromProfile =  this.$route.query.fromProfile;
    if (this.wikiHis.id != null) {
      this.initialize();
    }
  },

  methods: {
    //初始化
    initialize: function () {
      this.$nextTick(function () {
        this.$http.get(`/wiki/wikiHis/${this.wikiHis.id}`).then((response) => {
          this.wikiHis = response.data.data;
          this.oldContent = response.data.data.content;
          this.wikiHis.active = false;
        });
      });
    },

    //增加内容
    save: function () {
      if (this.wikiHis.content.trim().length === 0) {
        this.warningDialog = true;
        this.warningMsg = "Please check content ";
        return false;
      }

      if (this.fromProfile === undefined && this.wikiHis.content === this.oldContent) {
        this.warningDialog = true;
        this.warningMsg = "Nothing has been modified";
        return false;
      }

      if(this.fromProfile > 0){
        if (this.wikiHis.content === this.oldContent && !this.wikiHis.active) {
          this.warningDialog = true;
          this.warningMsg = "Nothing has been modified 1";
          return false;
        }
      }
      

      if (this.wikiHis.title.trim().length === 0) {
        this.warningDialog = true;
        this.warningMsg = "Please check title ";
        return false;
      }
      if (this.wikiHis.information.trim().length === 0) {
        this.warningDialog = true;
        this.warningMsg = "Please check Comment ";
        return false;
      }
      this.afterSave();
    },

    afterSave() {
      let router = this.$router;
      this.wikiHis.memberId = this.memberId; 
      let data = this.wikiHis;
      this.$nextTick(function () {
        this.$http.post("/wiki/wikiHis", data).then((response) => {
          router.go(-1);
        });
      });
    },

    //v-md-edtor upload image
    handleUploadImage(event, insertImage, files) {
      // Get the files and upload them to the file server, then insert the corresponding content into the editor
      // debugger
      let formData = new FormData();
      formData.append("file", files[0]);
      let imgUrl = "";
      this.$nextTick(function () {
        this.$http.post("/minio/vue_md_Editor", formData).then((response) => {
          // console.log(response.data.data)
          imgUrl = response.data.data;
          //添加图片
          insertImage({
            url: imgUrl,
            desc: "desc",
            width: "auto",
            height: "auto",
          });
        });
      });
    },
  },
};
</script>
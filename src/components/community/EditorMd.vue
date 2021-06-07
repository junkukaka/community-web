<template>
  <v-card flat>
    <v-text-field
      label="Title"
      hint="this is community title area"
      persistent-hint
      outlined
      :rules="titleRules"
      style="border-radius: 0"
      v-model.lazy="community.title"
    ></v-text-field>

    <v-md-editor
      @upload-image="handleUploadImage"
      :disabled-menus="[]"
      @save="saveDialog = true"
      :include-level="[1, 2, 3, 4]"
      left-toolbar="undo redo | h bold italic strikethrough quote | ul ol todo-list table hr | link image code | tip emoji "
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
      block
      class="mt-3 white--text "
      @click="saveDialog = true"
    >
      등록
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
          <v-btn color="green darken-1" text @click="save"> save </v-btn>
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
  props: ["parent"],
  data: () => ({
    community: {
      id: null,
      memberId: null,
      menuId: null,
      mdYn: 1,
      useYn: 0,
      title: "",
      content: "",
    },
    warningDialog: false,
    warningMsg: null,
    saveDialog: false,
    titleRules: [
      (v) => !!v || "title is required",
      (v) => (v && v.length <= 100) || "Name must be less than 100 characters",
    ],
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
      if (this.community.content.trim().length === 0) {
        this.warningDialog = true;
        this.warningMsg = "Please check content ";
        return false;
      }
      if (this.community.title.trim().length === 0) {
        this.warningDialog = true;
        this.warningMsg = "Please check title ";
        return false;
      }
      this.afterSave();
    },

    afterSave() {
      let router = this.$router;
      let data = this.community;
      this.$nextTick(function () {
        this.$http.post("/community/communitys", data).then((response) => {
          router.go(-1);
        });
      });
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


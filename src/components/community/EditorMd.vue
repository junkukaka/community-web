<template>
  <v-card flat>
    <v-row>
      <v-col cols="12" sm="12" md="8">
        <v-text-field
          label="title"
          hint="this is community title area"
          persistent-hint
          outlined
          style="border-radius: 0"
          v-model.lazy="community.title"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-row no-gutters>
          <v-col sm="6" md="3">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mt-2"
                  outlined
                  color="indigo"
                  @click="openMenu"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon class="mr-1">
                    mdi-menu-open
                  </v-icon>
                </v-btn>
              </template>
              <span>menu change</span>
            </v-tooltip>
          </v-col>
          <v-col sm="6" md="9">
            <v-text-field
              value.lazy="menu.id"
              label="menu name"
              v-model.lazy="menu.name"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-md-editor
      @upload-image="handleUploadImage"
      :disabled-menus="[]"
      @save="saveDialog = true"
      :include-level="[1, 2, 3, 4]"
      left-toolbar="h bold italic strikethrough quote | ul ol todo-list table hr | link image code | tip emoji "
      v-model="community.content"
      height="600px"
    >
    </v-md-editor>

     <!-- menus dialog start-->
    <v-dialog v-model="menuDialog" max-width="700">
      <v-card flat>
        <v-card-title class="text-h5">
          Community Menus
        </v-card-title>
        <v-card-text>
           <v-treeview
              activatable
              :items="menus"
              hoverable
              class="my-3 font-weight-medium"
            >
              <template slot="label" slot-scope="props">
                    <span style="color: #000000"  @click="changeMenu(props.item)">
                      {{ props.item.name }} 
                    </span>
              </template>
            </v-treeview>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="menuDialog = false"
          >
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- menus dialog end-->

    <v-btn
      large
      depressed
      color="primary"
      block
      class="mt-3 white--text "
      @click="save"
    >
      등록
      <v-icon right dark> mdi-content-save </v-icon>
    </v-btn>

    <pop-msg-dialog v-bind:parent="popMsg"/>
  </v-card>
</template>

<script>
import PopMsgDialog from "../com/PopMsgDialog.vue";

export default {
  components: {PopMsgDialog},
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
    titleRules: [
      (v) => !!v || "title is required",
      (v) => (v && v.length <= 100) || "Name must be less than 100 characters",
    ],
    popMsg: {
      dialog: false,
      content: null,
      title: null
    },
    files: [],
    menuDialog: false,
    menus: [],
    menu:{
      name:null,
      id:null
    }
  }),

  created() {
    this.community.menuId = this.$route.query.menuId;
    this.community.memberId = this.$store.state.member.id;
    this.community.id = this.$route.query.id;
    this.getMenu(this.community.menuId);
    if (this.community.id != null) {
      this.initialize();
    }
    this.getMenuTee();
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

    getMenu(id){
      this.$nextTick(function () {
        this.$http
          .get(`/communityMenu/menus/${id}`)
          .then((response) => {
            this.menu = response.data.data
          });
      });
    },

    getMenuTee(){
      if(this.menus.length === 0){
        this.$http.get("/communityMenu/menus/tree").then((response) => {
          this.menus= response.data.data;
        });
      }
    },

    openMenu () {
      this.menuDialog = true;
    },

    changeMenu(item){
      if(!(_.has(item,'children'))){
        this.community.menuId = item.id;
        this.menu.id = item.id;
        this.menu.name = item.name; 
      }else{
        this.updateError("대분류와 중분류를 선택할수가 없습니다.");
      }
      this.menuDialog = false;
    },

    updateError(error){
      this.popMsg.dialog = true;
      this.popMsg.title = "Warning Message";
      this.popMsg.content = error;
    },

    //增加内容
    save() {
      if(_.isNull(this.community.title) || _.eq(this.community.title,'')){
        this.updateError("제목을 입력해 주세요");
        return false;
      }else if(_.isNull(this.community.content) || _.eq(this.community.content,'')){
        this.updateError("내용을 주세요");
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
        }).catch((error) => {
          this.updateError(error);
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


<template>
  <v-card flat>
    <v-row>
      <v-col cols="12" sm="12" md="8">
        <v-text-field
          label="Title"
          hint="this is wiki title area"
          persistent-hint
          :rules="titleRules"
          outlined
          style="border-radius: 0"
          v-model.lazy="wikiHis.title"
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

    <!-- menus dialog start-->
    <v-dialog v-model="menuDialog" max-width="700">
      <v-card flat>
        <v-card-title class="text-h5">
          Wiki Menus
        </v-card-title>
        <v-card-text>
           <v-treeview
              activatable
              :items="menus"
              hoverable
              class="my-3 font-weight-medium"
            >
              <template slot="label" slot-scope="props">
                    <div style="color: #000000"  @click="changeMenu(props.item)">
                      {{ props.item.name }} 
                    </div>
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

    <pop-msg-dialog v-bind:parent="popMsg"/>
  </v-card>
</template>

<script>
import PopMsgDialog from "../com/PopMsgDialog.vue";

export default {
  components: {PopMsgDialog},
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
    member: {},
    oldContent:"",
    memberId : null,
    avatar: null,
    imgRules: [
      (value) =>
        !value ||
        value.size < 10000000 ||
        "Avatar size should be less than 10 MB!",
    ],
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
    popMsg: {
      dialog: false,
      content: null,
      title: null
    },
    menuDialog: false,
    menus: [],
    menu:{
      name:null,
      id:null
    }
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
    this.member = this.$store.state.member;
    this.wikiHis.menuId = this.$route.query.menuId;
    this.memberId = this.$store.state.member.id;
    this.wikiHis.id = this.$route.query.id;
    this.fromProfile =  this.$route.query.fromProfile;
    this.getMenu(this.wikiHis.menuId);
    if (this.wikiHis.id != null) {
      this.initialize();
    }
    this.getMenuTee();
  },

  //편집중일때 프라우저를 닫기전에 alert 창 뜨워주기
  mounted(){
    window.onbeforeunload = function(e){
      return ''
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

     getMenu(id){
      this.$nextTick(function () {
        this.$http
          .get(`/wikiMenu/menus/${id}`)
          .then((response) => {
            this.menu = response.data.data
          });
      });
    },

    getMenuTee(){
      let data = this.$data;
      let request = {
        params: {
          authority: data.member.authority,
          flag: 1,
        },
      };
      if(this.menus.length === 0){
        this.$http.get("/wikiMenu/menus/tree",request).then((response) => {
          this.menus= response.data.data;
        });
      }
    },

    openMenu () {
      this.menuDialog = true;
    },

    changeMenu(item){
      if(!(_.has(item,'children'))){
        this.wikiHis.menuId = item.id;
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
    save: function () {
      if(_.isNull(this.wikiHis.title) || _.eq(this.wikiHis.title,'')){
        this.updateError("제목을 입력해 주세요");
        return false;
      }else if(_.isNull(this.wikiHis.content) || _.eq(this.wikiHis.content,'')){
        this.updateError("내용을 주세요.");
        return false;
      }else if(this.fromProfile === undefined && this.wikiHis.content === this.oldContent) {
        this.updateError("변경 내용을 없습니다.");
        return false;
      }else if(this.fromProfile > 0){
        if (this.wikiHis.content === this.oldContent && !this.wikiHis.active) {
          this.updateError("변경 내용을 없습니다.");
          return false;
        }
      }else if(_.isNull(this.wikiHis.information) || _.eq(this.wikiHis.information,'')) {
       this.updateError("Comment 을 입력해주세요.");
        return false;
      }else if(this.wikiHis.content.length> 20000){
         this.updateError("20000자이상 저장 할수 없습니다.");
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
        }).catch((error) => {
          this.updateError(error);
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
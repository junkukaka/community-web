<template>
  <v-card flat>
    <v-row>
      <v-col cols="12" sm="12" md="8">
        <v-text-field
          :label="$t('title')"
          :hint="$t('titleHint')"
          persistent-hint
          outlined
          :rules="titleRules"
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
              <span>{{$t('pickSomeThing',{0:$t('menu')})}}</span>
            </v-tooltip>
          </v-col>
          <v-col sm="6" md="9">
            <v-text-field
              value.lazy="menu.id"
              :label="$t('menu')"
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


    <v-file-input
      v-model="files"
      color="deep-purple accent-4"
      counter
      :label="$t('fileUpload')"
      multiple
      :placeholder="$t('msgSelectFiles')"
      prepend-icon="mdi-paperclip"
      :show-size="1000"
      class="mt-5"
      :clearable="false"
    >
      <template v-slot:selection="{text }">
        <v-chip
          color="deep-purple accent-4"
          dark
          label
          small
        >
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>

    <v-progress-linear
      indeterminate
      color="primary"
      v-if="progress"
    ></v-progress-linear>

     <!-- menus dialog start-->
    <v-dialog v-model="menuDialog" max-width="700">
      <v-card flat>
        <v-card-title class="text-h5">
          {{$t('menu')}}
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

    <!-- file list -->
    <div class="pb-3" v-if="filesList">
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr v-for="item in filesList" :key="item.name">
              <td width="70%">{{ item.originalName }}</td>            
              <td width="30%" style="text-align:right">
                <v-btn class="mx-2" dark small color="primary" depressed @click="deleteFile(item.id)">
                  <v-icon>mdi-delete-forever</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <!-- file list end-->

    <v-btn
      large
      depressed
      color="primary"
      block
      class="mt-3 white--text "
      @click="save"
      :disabled = progress
    >
      {{$t('save')}}
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
      docId: ""
    },
    popMsg: {
      dialog: false,
      content: null,
      title: null
    },
    files: [],
    filesList: [],
    updateYn: true,
    menuDialog: false,
    menus: [],
    menu:{
      name:null,
      id:null
    },
    member: {},
    progress: false
  }),


  computed: {
    titleRules () {
      return [
          (v) => !!v || this.$t('required', {0: this.$t('title')}),
          (v) => (v && v.length <= 100) || this.$t('lessThan',{0:100})
        ]
    } ,
  },

  created() {
    this.member = this.$store.state.member;
    this.community.menuId = this.$route.query.menuId;
    this.community.memberId = this.$store.state.member.id;
    this.community.id = this.$route.query.id;
    this.getMenu(this.community.menuId);
    if (this.community.id != null) {
      this.initialize();
    }
    this.getMenuTee();
  },

   watch: {
    files: {
      handler(newVal,oldVal){
        for (const file of newVal) {
          if(file.size > 50000000){
            this.updateError(this.$t('fileLessThan',{0:"50M"}));
            this.files = [];
            this.updateYn = false;
            return false;
          }
        }
        if(this.updateYn){
          this.uploadFiles(newVal);
        }
      }
    }
  },

  methods: {
    //初始化
    initialize(){
      this.$http
        .get(`/community/communities/${this.community.id}`)
        .then((response)=> {
          this.community = response.data.data;
           if(this.community.docId != ""){
              this.selectFilesList();
            } 
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
      let data = this.$data;
      let request = {
        params: {
          authority: data.member.authority,
          flag: 1,
        },
      };
      if(this.menus.length === 0){
        this.$http.get("/communityMenu/menus/tree",request).then((response) => {
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
        this.updateError(this.$t('msgCannotPick01'));
      }
      this.menuDialog = false;
    },

    updateError(error){
      this.popMsg.dialog = true;
      this.popMsg.title = this.$t('warningMessage');
      this.popMsg.content = error;
    },

    //增加内容
    save() {
      if(_.isNull(this.community.title) || _.eq(this.community.title,'')){
        this.updateError(this.$t('required',{0:this.$t('title')}));
        return false;
      }else if(_.isNull(this.community.content) || _.eq(this.community.content,'')){
        this.updateError(this.$t('required',{0:this.$t('contant')}));
        return false;
      }else if(this.community.content.length > 20000){
         this.updateError(this.$t('lessThan',{0:20000}));
        return false;
      }
      this.afterSave();
    },

    afterSave() {
      let router = this.$router;
      let data = this.community;
      this.$nextTick(function () {
        this.$http.post("/community/communities", data).then((response) => {
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


    //上传文件
    uploadFiles(files){
      let formData = new FormData();
      formData.append("docId",this.community.docId);
      formData.append("flag","community");
      for(let i = 0; i< files.length; i++){
        formData.append(i,files[i]);
      }
      if(files.length > 0){
        this.progress = true;
      }
      
      this.$http.post("/files/upload", formData).then((response) => {
        const result = response.data.data;
        this.community.docId = result[0].docId;
        this.selectFilesList(); //回显
        this.progress = false;
      });
    },

    selectFilesList(){
      this.$http.get(`/files/list/${this.community.docId}`).then((response)=>{
        this.filesList = response.data.data;
      });
    },

    deleteFile(id){
      this.$http.delete(`/files/delete/${id}`).then((response)=>{
        this.filesList = response.data.data; 
      })
    },
  },
};
</script>


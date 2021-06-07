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
              value="menu.id"
              label="menu name"
              v-model="menu.name"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    

    <vue-editor id="Editor" v-model.lazy="community.content"> </vue-editor>

    <!-- <v-file-input
      v-model="files"
      color="deep-purple accent-4"
      counter
      label="File input"
      multiple
      placeholder="Select your files"
      prepend-icon="mdi-paperclip"
      :show-size="1000"
      class="mt-5"
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
    </v-file-input> -->


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
      <v-icon right dark> mdi-pencil </v-icon>
    </v-btn>

    <pop-msg-dialog v-bind:parent="popMsg"/>
  </v-card>
</template>

<script>
import { VueEditor, Quill } from "vue2-editor";
import PopMsgDialog from "../com/PopMsgDialog.vue";

export default {
  components: { VueEditor, Quill, PopMsgDialog },
  props: ["parent"],
  data: () => ({
    community: {
      id: null,
      userId: null,
      menuId: null,
      mdYn: 0,
      useYn: 0,
      title: "",
      content: "",
    },
    files: [],
    menus: [],
    menuDialog: false,
    popMsg: {
      dialog: false,
      content: null,
      title: null
    },
    menu:{
      name:null,
      id:null
    }
  }),

  created: function () {
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
    initialize: function () {
      this.$nextTick(function () {
        this.$http
          .get(`/community/communitys/${this.community.id}`)
          .then((response) => {
            this.community = response.data.data;
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

    openMenu: function () {
      this.menuDialog = true;
    },

    changeMenu: function(item){
      if(!(_.has(item,'children'))){
        this.community.menuId = item.id;
        this.menu.id = item.id;
        this.menu.name = item.name; 
      }
      this.menuDialog = false;
    },

    updateError(error){
      this.popMsg.dialog = true;
      this.popMsg.title = "Error Message";
      this.popMsg.content = error;
    },

    //增加内容
    save: function () {
      let router = this.$router;
      console.log(this.community);
      if(_.isNull(this.community.title) || _.eq(this.community.title,'')){
        this.updateError("제목을 입력해 주세요");
        return false;
      }else if(_.isNull(this.community.content) || _.eq(this.community.content,'')){
        this.updateError("내용을 주세요");
        return false;
      }

      this.$nextTick(function () {
        this.$http
          this.$http.post("/community/communitys", this.community)
          .then((response) => {
            router.go(-1);
          }).catch((error) => {
            this.updateError(error);
          });
      });
    },
  },
};
</script>


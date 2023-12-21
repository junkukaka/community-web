<template>
  <v-card flat class="pa-2">
    <v-card flat color="grey lighten-4" class="mb-5">
      <v-toolbar flat color="indigo">
        <v-toolbar-title class="font-weight-light white--text">
          위키 관리
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          append-icon="mdi-magnify"
          label="Search Title"
          single-line
          hide-details
          class="mb-3"
          v-model="searchTitle"
          @keyup.native.enter="initialize"
        ></v-text-field>

        <v-autocomplete
          v-model="memberSelect"
          :items="members"
          item-text="memberName"
          item-value="id"
          no-data-text="검색된 회원이 없습니다."
          :search-input.sync="search"
          chips
          multiple
          label="닉네임"
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="remove(data.item)"
            >
              <v-avatar left>
                <v-img :src="data.item.picture != null ? data.item.picture : 'http://aspnc.com.cn:9000/community/2021/2021-11/2021-11-25/296c75a6-e897-4035-9b36-90c7fbc5ec6c.png'"></v-img>
              </v-avatar>
              {{ data.item.memberName }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <template>
              <v-list-item-avatar>
                <img :src="data.item.picture != null ? data.item.picture : 'http://aspnc.com.cn:9000/community/2021/2021-11/2021-11-25/296c75a6-e897-4035-9b36-90c7fbc5ec6c.png'" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-html="data.item.memberName"
                ></v-list-item-title>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="indigo" @click="initialize"> 
            <v-icon left>
              mdi-update
            </v-icon>
             Search Community
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      flat
      :headers="headers"
      :items="wikis"
      :disable-pagination="disablePagination"
      class="elevation-1 mytable"
      hide-default-footer
    >
      <template v-slot:[`item.title`]="{ item }">
        <div>
          <router-link
            :to="`/wiki/wikiDetail?wikiId=${item.id}`"
            color="indigo"
            v-text="
              `${
                item.title.length < 35
                  ? item.title
                  : item.title.substring(0, 35) + '...'
              }`
            "
          />
        </div>
      </template>

      <template v-slot:[`item.registerTime`]="{ item }">
        {{ item.registerTime |date-format('yyyy-mm-dd') }}
      </template>
      <!-- {{ item.registerTime |date-format('yyyy-mm-dd') }} -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn text @click="showComment(item.id)">
          <v-icon small class="mr-2"> mdi-pencil </v-icon>
          history
        </v-btn>
        <v-btn text @click="deleteItem(item.id)">
          <v-icon small> mdi-delete </v-icon>
          Delete
        </v-btn>
      </template>
    </v-data-table>

    <!-- 댓글 dialog -->
    <v-dialog v-model="commmentDialog" width="700">
      <v-card flat>
        <v-card-title
          v-text="`Wiki History List`"
          class="indigo white--text"
        >
        </v-card-title>
        <v-divider class="ml-3"></v-divider>
        <v-list v-if="commentList.length > 0">
          <template v-for="(item, index) in commentList">
            <v-divider
              v-if="item.divider"
              :key="index"
              :inset="item.inset"
            ></v-divider>
            <v-list-item v-else :key="index">
              <v-list-item-avatar>
                <v-avatar color="#E0E0E0" v-if="item.picture == ''">
                  <v-icon dark class="mr-2" size="52">
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
                <v-avatar v-if="item.picture != ''">
                  <img :src="item.picture" :alt="`photo`" />
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.memberName }}</v-list-item-title>
                <v-list-item-subtitle class="pb-7"
                  v-html="`${item.information}`"
                ></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-subtitle>
                  {{ item.registerTime |date-format('yyyy-mm-dd') }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-btn text @click="deleteComment(item.id)" v-if="item.activeYn == 0">
                    <v-icon small> mdi-delete </v-icon>
                  </v-btn>
                  <v-chip v-if="item.activeYn == 1"
                      class="mr-3"
                      color="green"
                      label
                      text-color="white"
                    >
                      <v-icon left>
                        mdi-label
                      </v-icon>
                      Active
                    </v-chip>
                </v-list-item-subtitle>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-dialog>

    <v-card flat class="mt-5">
      <template>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="pages"
            :total-visible="7"
          ></v-pagination>
        </div>
      </template>
    </v-card>
  </v-card>
</template>

<script>
export default {
  props: ["parent"],
  data: () => ({
    page: 1,
    itemsPerPage: 30,
    pages: 1,
    wikis: [],
    dialogDelete: false,
    disablePagination: true,
    commmentDialog: false,
    commentList: [],
    members: [],
    memberSelect: [],
    search: null,
    searchTitle: null,
    headers: [
      { text: "Title", align: "start", value: "title" },
      { text: "Actions", value: "actions", sortable: false, align: "center" },
    ],
    deletedId: -1,
    EdittingCommuniy: -1,
  }),

  watch: {
    page: function () {
      this.initialize();
    },

    dialog(val) {
      val || this.close();
    },
    
    dialogDelete(val) {
      val || this.closeDelete();
    },

    search(val){
      if(val){
        this.getMembersSearchByName();
      }
    }

  },

  created() {
    this.member = this.$props.parent;
    this.initialize();
  },

  methods: {
    initialize() {
      let memberSelects = this.memberSelect.toString();
      if(memberSelects == '') {
        memberSelects = null;
      }

      let request = {
        params: {
          searchTitle: this.searchTitle,
          members: memberSelects,
          page: this.page,
          itemsPerPage: this.itemsPerPage,
        },
      };
      //console.log(request);
      //select community list by member
      this.$nextTick(function () {
        this.$http
          .get("/adminArticle/wiki/selectWikis", request)
          .then((response) => {
            this.wikis = response.data.data.wikis;
            this.page = response.data.data.page; //当前页面
            this.pages = response.data.data.pages; //页数
          });
      });
    },

    // 댓글 관리
    showComment(id) {
      this.commmentDialog = true;
      this.getComments(id);
      this.EdittingCommuniy = id;
    },

    getComments(id) {
      this.commentList = [];
      this.$nextTick(function () {
        this.$http.get(`/adminArticle/wiki/selectWikiHis/${id}`).then((response) => {
          const comments = response.data.data;
          console.log(this.comments);
          //下划线处理
          for (let i = 0; i < comments.length; i++) {
            this.commentList.push(comments[i]);
            this.commentList.push({ divider: true, inset: true });
          }
        });
      });
    },

    // 댓글 삭제
    deleteComment(id) {
      this.dialogDelete = true;
      this.deleteFlag = "COMMENT";
      this.deletedId = id;
    },

    // WIKI 삭제
    deleteItem(id) {
      this.deletedId = id;
      this.deleteFlag = "WIKI";
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      if (this.deleteFlag == "WIKI") {
        this.$http
          .delete(`/adminArticle/wiki/deleteWiki/${this.deletedId}`)
          .then((response) => {
            if (response.data.code == 200) {
              this.closeDelete();
            }
          });
      } else if (this.deleteFlag == "COMMENT") {
        this.$http
          .delete(`/adminArticle/wiki/deleteWikiHis/${this.deletedId}`)
          .then((response) => {
            if (response.data.code == 200) {
              this.closeDelete();
              this.getComments(this.EdittingCommuniy);
            }
          });
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.initialize();
    },

    //회원 검색
    getMembersSearchByName() {
      this.members = [];
      this.$nextTick(function () {
        this.$http
          .get(`/member/getMembersSearchByName/${this.search}`)
          .then((response) => {
            this.members = response.data.data;
          });
      });
    },

    remove(item) {
      const index = this.memberSelect.indexOf(item.id);
      if (index >= 0) this.memberSelect.splice(index, 1);
    },

  },
};
</script>

<style scoped>
.v-application .elevation-1 {
  box-shadow: none !important;
}
</style>


<template>
  <div style="margin: 47px 0px 30px">
    <v-card class="mx-lg-auto boxShadow" flat style="max-width: 1280px">
      <v-card-title class="headline primary lighten-1">
        <span style="color: white"> Search for Public Contens </span>
      </v-card-title>
      <v-card-text class="pt-5">
        <v-card class="d-flex justify-space-between" style="height: 61px" flat>
          <v-select
            :items="selects"
            label="위키/커뮤니티"
            item-text="state"
            item-value="abbr"
            v-model="searchObj.ty"
            outlined
            class="mr-5"
          ></v-select>
          <v-select
            :items="selectOptions"
            label="제목/내용"
            item-text="state"
            item-value="abbr"
            v-model="searchObj.option"
            outlined
            @change="searchingRuslt"
          ></v-select>
        </v-card>

        <v-card flat class="d-flex justify-space-between mt-2">
          <v-autocomplete
            v-model="memberSelect"
            :items="members"
            item-text="memberName"
            item-value="id"
            no-data-text="검색된 회원이 없습니다."
            :search-input.sync="searchMemberName"
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
                  <v-img
                    :src="
                      data.item.picture != null
                        ? data.item.picture
                        : 'http://aspnc.com.cn:9000/community/2021/2021-11/2021-11-25/296c75a6-e897-4035-9b36-90c7fbc5ec6c.png'
                    "
                  ></v-img>
                </v-avatar>
                {{ data.item.memberName }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <template>
                <v-list-item-avatar>
                  <img
                    :src="
                      data.item.picture != null
                        ? data.item.picture
                        : 'http://aspnc.com.cn:9000/community/2021/2021-11/2021-11-25/296c75a6-e897-4035-9b36-90c7fbc5ec6c.png'
                    "
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="data.item.memberName"
                  ></v-list-item-title>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>

          <v-btn
            class="ml-5 mt-3"
            depressed
            large
            color="primary"
            @click="menusDialog"
            v-if="menuShowYn"
          >
            {{ menubtn }}
            <v-icon class="pl-2">mdi-format-list-bulleted-square</v-icon>
          </v-btn>
        </v-card>
        <v-card flat class="pt-3 d-flex justify-space-between">
          <v-text-field
            v-model="searchObj.content"
            append-icon="mdi-magnify"
            label="Search"
            outlined
            hide-details
            @keyup.native.enter="searchingRuslt"
          ></v-text-field>

           <v-btn
            class="ml-5 mt-2"
            depressed
            large
            color="primary"
            @click="searchingRuslt"
            v-if="menuShowYn"
          >
            search
            <v-icon class="pl-2">mdi-layers-search-outline</v-icon>
          </v-btn>

        </v-card>
      </v-card-text>
      <v-divider class="pt-5"></v-divider>
      <v-expand-transition>
        <v-data-table
          flat
          :headers="headers"
          :items="results"
          :disable-pagination="disablePagination"
          class="elevation-1 mytable"
          hide-default-footer
          :loading="loadingFlag"
          loading-text="Loading... Please wait"
        >
          <template v-slot:[`item.title`]="{ item }">
            <!-- WIKI LINK -->
            <router-link
              :to="`/wiki/wikiDetail?wikiId=${item.id}`"
              color="primary"
              v-if="item.ty == 'WIKI'"
            >
              <div
                v-text="
                  `${
                    item.title.length < 70
                      ? item.title
                      : item.title.substring(0, 70) + '...'
                  }`
                "
              ></div>
            </router-link>

            <!-- COMMUNIYT LINK -->
            <router-link
              :to="`/community/communityDetail?id=${item.id}`"
              color="primary"
              v-if="item.ty == 'COMMUNITY'"
            >
              <div
                v-text="
                  `${
                    item.title.length < 70
                      ? item.title
                      : item.title.substring(0, 70) + '...'
                  }`
                "
              ></div>
            </router-link>
          </template>
        </v-data-table>
      </v-expand-transition>
      <v-card-actions class="justify-space-between">
        <div style="width: 80%; margin: 15px auto" v-if="morePage">
          <v-btn
            class="pa-5"
            outlined
            block
            @click="morePageAction"
            color="primary"
          >
            More
          </v-btn>
        </div>
        <v-btn :disabled="!results" color="primary" @click="results = []">
          Clear
          <v-icon right> mdi-close-circle </v-icon>
        </v-btn>
      </v-card-actions>

      <!-- wikiMenusDialog  -->
      <v-dialog
        v-model="wikiMenusDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="wikiMenusDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="wikiTree = []"> Reset </v-btn>
              <v-btn dark text @click="wikiMenusDialog = false"> 확인 </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-card-text>
                <v-treeview
                  v-model="wikiTree"
                  :items="wikiMenu"
                  selected-color="indigo"
                  open-on-click
                  selectable
                  return-object
                  expand-icon="mdi-chevron-down"
                  on-icon="mdi-bookmark"
                  off-icon="mdi-bookmark-outline"
                  indeterminate-icon="mdi-bookmark-minus"
                >
                </v-treeview>
              </v-card-text>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="12" md="6">
              <v-card-text>
                <div
                  v-if="wikiTree.length === 0"
                  key="title"
                  class="text-h6 font-weight-light grey--text text-center"
                >
                  Select your wiki menus
                </div>

                <v-scroll-x-transition group hide-on-leave>
                  <v-chip
                    v-for="(selection, i) in wikiTree"
                    :key="i"
                    color="grey"
                    dark
                    small
                    class="ma-1"
                  >
                    <v-icon left small> mdi-beer </v-icon>
                    {{ selection.name }}
                  </v-chip>
                </v-scroll-x-transition>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>

      <!-- communityMenusDialog  -->
      <v-dialog
        v-model="communityMenusDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="communityMenusDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="communityTree = []"> Reset </v-btn>
              <v-btn dark text @click="communityMenusDialog = false">
                확인
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-card-text>
                <v-treeview
                  v-model="communityTree"
                  :items="communityMenu"
                  selected-color="indigo"
                  open-on-click
                  selectable
                  return-object
                  expand-icon="mdi-chevron-down"
                  on-icon="mdi-bookmark"
                  off-icon="mdi-bookmark-outline"
                  indeterminate-icon="mdi-bookmark-minus"
                >
                </v-treeview>
              </v-card-text>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="12" md="6">
              <v-card-text>
                <div
                  v-if="communityTree.length === 0"
                  key="title"
                  class="text-h6 font-weight-light grey--text text-center"
                >
                  Select your community menus
                </div>

                <v-scroll-x-transition group hide-on-leave>
                  <v-chip
                    v-for="(selection, i) in communityTree"
                    :key="i"
                    color="grey"
                    dark
                    small
                    class="ma-1"
                  >
                    <v-icon left small> mdi-beer </v-icon>
                    {{ selection.name }}
                  </v-chip>
                </v-scroll-x-transition>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    member: {},
    selects: [
      { state: "Wiki", abbr: "WIKI" },
      { state: "Community", abbr: "COMMUNITY" },
      { state: "Wiki&Community", abbr: "WC" },
    ],
    selectOptions: [
      { state: "제목", abbr: "T" },
      { state: "내용", abbr: "C" },
      { state: "제목&내용", abbr: "TC" },
    ],
    searchObj: {
      ty: null,
      content: null,
      registerId: null,
      option: "TC",
      menus: [],
      members: [],
      page: 0,
      size: 20,
    },
    results: [],
    memberSelect: [],
    members: [],
    searchMemberName: null,
    wikiMenusDialog: false,
    wikiTree: [],
    wikiMenu: [],
    menubtn: "위키 메뉴",
    communityMenusDialog: false,
    communityTree: [],
    communityMenu: [],
    menuShowYn: true,
    headers: [
      { text: "Title", align: "start", value: "title" },
      { text: "Menu Name", value: "menuName", align: "start" },
      { text: "Type", value: "ty", align: "start" },
    ],
    disablePagination: true,

    pageNum: 1,
    morePage: true,
    loadingFlag : false
  }),

  computed: {
    items() {
      return this.entries.map((entry) => {
        const content =
          entry.content.length > this.descriptionLimit
            ? entry.content.slice(0, this.descriptionLimit) + "..."
            : entry.content;

        return Object.assign({}, entry, { content });
      });
    },
  },

  created: function () {
    this.searchObj.ty = this.$route.query.flag;
    this.member = this.$store.state.member;
    this.searchObj.content = this.$route.query.content;
    this.searchObj.registerId = this.$store.state.member.id;
    this.searchingRuslt();
    this.getMenus();
  },

  watch: {
    $route() {
      this.searchObj.content = this.$route.query.content;
      this.searchingRuslt();
    },

    searchMemberName(val) {
      if (val) {
        this.getMembersSearchByName();
      }
    },

    ["searchObj.ty"](val) {
      this.searchObj.menus = [];
      if (val == "COMMUNITY") {
        this.menubtn = "커뮤니티 메뉴";
        this.menuShowYn = true;
      } else if (val == "WIKI") {
        this.menubtn = "위키 메뉴";
        this.menuShowYn = true;
      } else {
        this.menuShowYn = false;
        (this.wikiTree = []),
          (this.communityTree = []),
          (this.searchObj.menus = []);
      }
      this.results = [];
    },
  },

  methods: {
    searchingRuslt() {
      this.results = [];
      this.searchObj.page = 0;
      this.morePage = true;
      this.loadingFlag = true;
      this.searching();
      
    },

    searching() {
      if (_.trim(this.searchObj.content) === "") {
        return false;
      }

      this.searchObj.content = _.trim(this.searchObj.content);
      //meus
      this.searchObj.menus = [];
      if (this.searchObj.ty == "WIKI") {
        if (this.wikiTree.length > 0) {
          for (const item of this.wikiTree) {
            this.searchObj.menus.push(item.id);
          }
        }
      } else {
        if (this.communityTree.length > 0) {
          for (const item of this.communityTree) {
            this.searchObj.menus.push(item.id);
          }
        }
      }

      //members
      if (this.memberSelect.length > 0) {
        this.searchObj.members = this.memberSelect;
      }

      // console.log(this.searchObj);
      this.$nextTick(function () {
        this.$http;
        this.$http
          .post("/search/comprehensive", this.searchObj)
          .then((response) => {
            //没有返回结果的话不在显示 btn
            if (response.data.data.length == 0) {
              this.morePage = false;
            }
            for (const data of response.data.data) {
              this.results.push(data);
            }
            this.loadingFlag = false;
          });
      });
    },

    menusDialog() {
      if (this.searchObj.ty == "COMMUNITY") {
        this.communityMenusDialog = true;
      } else {
        this.wikiMenusDialog = true;
      }
    },

    //회원 검색
    getMembersSearchByName() {
      this.members = [];
      this.$nextTick(function () {
        this.$http
          .get(`/member/getMembersSearchByName/${this.searchMemberName}`)
          .then((response) => {
            this.members = response.data.data;
          });
      });
    },

    remove(item) {
      const index = this.memberSelect.indexOf(item.id);
      if (index >= 0) this.memberSelect.splice(index, 1);
    },

    //위키 메뉴 가져오기
    getMenus() {
      this.wikiMenu = this.$store.state.wikiMenus;
      this.communityMenu = this.$store.state.communityMenus;
    },

    morePageAction() {
      if (this.morePage) {
        this.searchObj.page = this.searchObj.size * this.pageNum;
        this.searching();
      }
      this.pageNum++;
    },
  },
};
</script>
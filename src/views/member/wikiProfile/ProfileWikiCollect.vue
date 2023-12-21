<template>
  <v-card flat class="pa-2 mt-12">
    <v-row>
      <v-col cols="12" lg="4" md="5" sm="12">
        <v-card class="mx-auto" tile flat>
          <v-subheader>
            <v-btn depressed color="indigo" width="100%" @click="newMenu" class="white--text">
              <v-icon dark> mdi-plus </v-icon>
              {{$t('newWikiCollectMenu')}}
            </v-btn>
          </v-subheader>
          <v-list dense nav class="pl-4 pr-4">
            <v-list-item-group color="indigo">
              <v-list-item
                style="border-radius: 0; border-bottom: 1px solid #e0e0e0"
                v-for="(item, i) in wikiMemberMenus"
                :key="i"
                @click="selectWikiCollect(item.id, item.menuName)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item.menuName"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon @click="editwikiMemberMenu(item)">
                  <v-icon class="pr-3 pl -3">mdi-pencil</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" lg="8" md="7" sm="12">
        <v-card flat>
          <!-- 즐겨찾기 리스트 -->
          <v-card-title class="d-flex justify-space-between">
            <div
              v-if="wikiCollectTitle != null"
              v-text="wikiCollectTitle.substring(0, 30)"
            ></div>
            <div v-if="wikiCollectTitle == null" v-text="$t('wikiCollect')"></div>
            <div>
              <v-btn depressed color="indigo" @click="selectAllWikiCollect" class="white--text">
                {{$t('all')}}
              </v-btn>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-data-table
            :headers="headers"
            :items="collectWikis"
            item-key="title"
            class="elevation-1 mytable"
            :disable-pagination="disablePagination"
            hide-default-footer
            :search="search"
            :custom-filter="filterOnlyCapsText"
          >
            <template v-slot:top>
              <v-text-field
                v-model="search"
                :label="$t('search') + $t('title')"
                class="mx-4"
              ></v-text-field>
            </template>
            <template v-slot:[`item.title`]="{ item }">
              <router-link
                :to="`/wiki/wikiDetail?wikiId=${item.wikiId}`"
                color="indigo"
              >
                <div
                  v-text="
                    `${
                      item.title.length < 35
                        ? item.title
                        : item.title.substring(0, 35) + '...'
                    }`
                  "
                ></div>
              </router-link>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn text @click="wikiCollectEdit(item)">
                <v-icon small class="mr-2" > mdi-pencil </v-icon>
                {{$t('edit')}}
              </v-btn>
              <v-btn text @click="deleteWikiCollect(item)">
                <v-icon small> mdi-delete </v-icon>
                {{$t('delete')}}
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- dialog -->
    <v-dialog v-model="wikiMenusEditDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
         {{$t('newWikiCollectMenu')}}
        </v-card-title>

        <v-card-text class="mt-3">
          <v-text-field
            v-model="wikiMemberMenu.menuName"
            :counter="100"
            :label="$t('menu')"
            required
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            color="grey darken-2"
            dark
            @click="dialogDelete = true"
          >
            {{$t('delete')}}
          </v-btn>
          <v-btn color="indigo" depressed @click="saveWikiCollectMenu" class="white--text">
            {{$t('ok')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >{{$t('msgDelteConfirm')}}</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = false"
            >{{$t('cancel')}}</v-btn
          >
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >{{$t('ok')}}</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- wiki memeber collect  -->
    <v-dialog v-model="wikiMemberMenusDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 orange white--text" >
          {{$t('wiki')}}{{$t('collect')}}{{$t('menu')}}
        </v-card-title>
        <v-card-text class="mt-10 text-center">
          <v-select
            v-if="wikiMemberMenus.length > 0"
            :items="wikiMemberMenus"
            :label="$t('wiki')+$t('collect')+$t('menu')"
            item-text="menuName"
            item-value="id"
            outlined
            @change="saveCollect"
            v-model="selectWikiMenu"
          ></v-select>
          <v-btn
              v-if="wikiMemberMenus.length == 0"
              x-large
              color="success"
              dark
              depressed
              to="/member/wikiCollect"
              target="_blank"  
            >
              <v-icon>mdi-format-list-bulleted-square</v-icon>
              즐겨찾기 메뉴 
            </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    wikiMenusEditDialog: false,
    dialogDelete: false,
    EditeFlag: 1,
    member: {},
    disablePagination: true,
    wikiMemberMenu: {},
    wikiMemberMenus: [],
    collectWikis: [],
    search: "",
    wikiCollectTitle: null,
    wikiMemberMenusDialog: false,
    avtiveWikiMenu:null,
    selectWikiMenu: null,
    selectWikiId: null,
  }),

  computed: {
    headers(){
      return [
        { text: this.$t('title'), align: "start", value: "title" },
        { text: this.$t('actions'), value: "actions", sortable: false, align: "center" },
      ]
    }
  },

  created() {
    this.member = this.$store.state.member;
    this.wikiMemberMenu.memberId = this.member.id;
    this.initialize();
  },

  methods: {
    initialize() {
      //select community list by member
      this.selectWikiCollectMenu();
      this.selectAllWikiCollect();
    },

    selectWikiCollectMenu() {
      this.$nextTick(function () {
        this.$http
          .get(
            `/wikiCollect/collectMenu/selectCollectMenuListByMember/${this.member.id}`
          )
          .then((response) => {
            this.wikiMemberMenus = response.data.data;
          });
      });
    },

    newMenu() {
      this.wikiMenusEditDialog = true;
      this.EditeFlag = 0;
      //初始化wikiMemberMenu
      this.wikiMemberMenu.menuName = null;
    },

    saveWikiCollectMenu() {
      if (this.EditeFlag == 0) {
        this.$http
          .post(
            "/wikiCollect/collectMenu/saveCollectWikiMemberCollectMenu",
            this.wikiMemberMenu
          )
          .then((response) => {
            this.selectWikiCollectMenu();
            this.wikiMenusEditDialog = false;
          });
      } else {
        this.$http
          .put(
            "/wikiCollect/collectMenu/updateCollectWikiMemberCollectMenu",
            this.wikiMemberMenu
          )
          .then((response) => {
            this.selectWikiCollectMenu();
            this.wikiMenusEditDialog = false;
          });
      }
    },

    editwikiMemberMenu(item) {
      this.EditeFlag = 1;
      this.wikiMenusEditDialog = true;
      this.wikiMemberMenu.id = item.id;
      this.wikiMemberMenu.menuName = item.menuName;
    },

    deleteItemConfirm() {
      this.$http
        .delete(
          `/wikiCollect/collectMenu/deleteCollectWikiMemberCollectMenu/${this.wikiMemberMenu.id}`
        )
        .then((response) => {
          this.selectWikiCollectMenu();
          this.wikiMenusEditDialog = false;
          this.dialogDelete = false;
        });
    },

    /**
     * 전체 회원별 즐겨찾기
     */
    selectAllWikiCollect() {
      this.wikiCollectTitle = null;
      this.$http
        .get(`/wikiCollect/collect/selectAllWikiCollect/${this.member.id}`)
        .then((response) => {
          this.collectWikis = response.data.data;
        });
    },

    /**
     * collect 메뉴별고 위키 조회하기
     */
    selectWikiCollect(id, title) {
      this.wikiCollectTitle = title;
      this.avtiveWikiMenu = id;
      this.$http
        .get(`/wikiCollect/collect/selectWikiCollect/${id}`)
        .then((response) => {
          this.collectWikis = response.data.data;
        });
    },

    filterOnlyCapsText(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        (value.toString().toLocaleUpperCase().indexOf(search) !== -1 ||
          value.toString().toLocaleLowerCase().indexOf(search) !== -1 ||
          value.toString().indexOf(search) !== -1)
      );
    },

    deleteWikiCollect(item) {
      this.$http
        .delete(
          `/wikiCollect/collect/deleteWikiCollect/${item.wikiId}/${this.member.id}`
        )
        .then((response) => {
          if (response.data.code == 200) {
            this.selectWikiCollect(item.collectMenuId);
          }
        });
    },


    //즐겨찾기 저장
    saveCollect(){
      this.wikiMemberMenusDialog = false;
      let params = {
        collectMenuId: this.selectWikiMenu,
        memberId: this.member.id,
        wikiId: this.selectWikiId
      }

      this.$http.post("/wikiCollect/collect/saveWikiCollect",params)
        .then((response) => {
          if(response.status == 200){
            this.selectWikiCollect(this.avtiveWikiMenu,this.wikiCollectTitle);
          }
      })
    },

    wikiCollectEdit(item){
      this.selectWikiId = item.wikiId;
      this.wikiMemberMenusDialog = true;
    }
    


  },


};
</script>

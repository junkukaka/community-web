<template>
  <v-card flat class="pb-12">
    <!-- 권한관리 메세지  -->
    <v-alert
      shaped
      prominent
      type="error"
      v-if="authorityView"
    >
      {{$t('authorityBanMSG')}}
    </v-alert>

     <div style="margin: -10px 0 10px -10px">
      <!-- dashboard -->
      <dashboard-vue/>
    </div>
    <v-card flat class="mt-n3">
       <div class="text-overline font-weight-light pl-5 pt-2">
          {{$t('lastUpdate')}}
          {{
            wikiHis.registerTime | date-format("yyyy-mm-dd hh:mi:ss")
          }}
        </div>
      <v-card-title class="text-h3 font-weight-medium pt-1 pb-1">
        {{ wikiHis.title }}
      </v-card-title>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="text-overline font-weight-regular">
            <span class="mr-3"> {{ wikiInfoCount.hitsCount }}  {{$t('views')}} </span>
            <span class="mr-3"> {{ wikiInfoCount.likesCount }} {{$t('likes')}}</span>
            <span class="mr-3"> {{ wikiInfoCount.collectCount }} {{$t('collect')}}</span>
            <!-- <span class="mr-3"> {{ wikiInfoCount.collectCount }} collect</span> -->
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions style="padding: 0px">
        <v-list-item class="grow" >
          <v-list-item-avatar  v-for="(member,id) in wikiHisMembers" :key="id">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attr }">
                <v-avatar size="41" v-if="member.picture"
                  v-bind="attr"
                  v-on="on"
                >
                  <img :src="member.picture" :alt="`photo`" />
                </v-avatar>
                <v-avatar size="41" color="indigo" v-if="!member.picture" 
                  v-bind="attr"
                  v-on="on"
                >
                  <v-icon dark>
                    mdi-account-circle 
                  </v-icon>
                </v-avatar>
              </template>
              <span>{{member.member_name}}</span>
            </v-tooltip>  
          </v-list-item-avatar>
        </v-list-item>
      </v-card-actions>
      <v-divider></v-divider>
      <v-md-editor v-model="wikiHis.content" mode="preview" ref="editor" />
      <!-- anchor -->

      <div class="anchorArea d-none d-lg-block" v-if="titles.length > 0" v-show="$store.state.ifMobile">
        <h6 class="text-h6 pb-1">{{$t('catalogue')}}</h6>
        <div class="ml-3 anchorAreaBox">
          <div
            v-for="(anchor, i) in titles"
            :key="i"
            :style="{ padding: `0 0 0 ${anchor.indent * 17 + 10}px` }"
            @click="handleAnchorClick(anchor)"
            :class="{
              contentsBorder: anchor.lineIndex == contentsTitle,
              normalBorder: anchor.lineIndex != contentsTitle,
            }"
          >
            <a> {{ anchor.title }} {{anchor.top}} </a>
          </div>
        </div>
      </div>
      <!-- anchor  end -->
      
    </v-card>

    <!-- icon dial -->
    <v-speed-dial
      v-model="fab"
      right
      direction="top"
      open-on-hover
      transition="slide-y-reverse-transition"
      fixed
      class="rightBottomArea"
      v-if="this.memberAuthority.editYn == 1"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-format-list-bulleted-square </v-icon>
        </v-btn>
      </template>
      <v-btn
        fab
        dark
        small
        color="green"
        :to="`/wiki/wikiEdit?&menuId=${wikiHis.menuId}&id=${wikiHis.id}`"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn fab dark small color="indigo" @click="timeLineDialog = true">
        <v-icon>mdi-history</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        :color="`${
          this.memberLikesAndCollect.memberCollectYn == 1 ? 'grey' : 'orange'
        }`"
        @click="wikiMemberMenusDialog = true"
      >
        <v-icon>mdi-star</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        :color="`${
          this.memberLikesAndCollect.memberLikesYn == 1 ? 'grey' : 'red'
        }`"
        @click="saveLikes"
      >
        <v-icon>mdi-thumb-up</v-icon>
      </v-btn>
    </v-speed-dial>
    <!-- icon dial -->

    <v-row justify="center">
      <v-dialog v-model="timeLineDialog" width="700px">
        <v-card class="pa-3">
          <HisTimeLine v-bind:parent="wikiId" />
        </v-card>
      </v-dialog>
    </v-row>

    <!-- wiki memeber collect  -->
    <v-dialog v-model="wikiMemberMenusDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 orange white--text" >
          {{$t('wikiCollectMenu')}}
        </v-card-title>
        <v-card-text class="mt-10 text-center">
          <v-select
            v-if="wikiMemberMenus.length > 0"
            :items="wikiMemberMenus"
            :label="$t('wikiCollectMenu')"
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
import HisTimeLine from "./HisTimeLine";
import DashboardVue from "../com/Dashboard.vue";

export default {
  components: {
    DashboardVue,
    HisTimeLine,
  },

  data: () => ({
    wikiId: null,
    wikiHis: {},
    titles: [],
    dialog: false,
    timeLineDialog: false,
    fab: false,
    contentsTitle: 0,
    member: {},
    memberAuthority: {},
    wikiHisMembers: [],
    memberLikesAndCollect: {},
    wikiInfo: {
      wikiId: null,
      memberId: null,
    },
    wikiInfoCount: {
      hitsCount: 0,
      likesCount: 0,
      collectCount: 0,
      commentCount: 0,
    },
    wikiMemberMenusDialog: false,
    wikiMemberMenus:[],
    selectWikiMenu: null,
    authorityView : false
  }),

  created() {
    this.wikiId = this.$route.query.wikiId;
    this.member = this.$store.state.member;
    this.wikiInfo.wikiId = this.$route.query.wikiId;
    this.wikiInfo.memberId = this.member.id;
    this.getWikiHisDetail();
    this.getInfoCount();
    this.selectWikiHisMembers();
    this.getMemberLikeAndCollect();
    this.saveHits();
    this.selectWikiCollectMenu();
  },

  mounted() {
    let br;
    let i = 0;
    //try 10s
    while (i < 7) {
      br = this.$refs.editor.$el.querySelectorAll(
        ".v-md-editor-preview h1,h2,h3,h4"
      );
      //加载导航
      this.sleep(1000).then(() => {
        // 这里写sleep之后需要去做的事情
        const anchors = this.$refs.editor.$el.querySelectorAll(
          ".v-md-editor-preview h1,h2,h3,h4,h5,h6"
        );
        const titles = Array.from(anchors).filter(
          (title) => !!title.innerText.trim()
        );

        if (!titles.length) {
          this.titles = [];
          return;
        }

        const hTags = Array.from(
          new Set(titles.map((title) => title.tagName))
        ).sort();

        this.titles = titles.map((el) => ({
          title: el.innerText,
          lineIndex: el.getAttribute("data-v-md-line"),
          indent: hTags.indexOf(el.tagName)
        }));
      });

      //由于网页加载可能有延迟，导航加载时间会出现延迟。
      if (br.length > 0) {
        // console.log(`${i} ---- ${br.length}`);
        break;
      }

      i++;
    }
  },


  methods: {
    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    //v-md-editor nav
    handleAnchorClick(anchor) {
      const { editor } = this.$refs;
      const { lineIndex } = anchor;
      this.contentsTitle = lineIndex;
      const heading = editor.$el.querySelector(
        `.v-md-editor-preview [data-v-md-line="${lineIndex}"]`
      );

      if (heading) {
        editor.previewScrollToTarget({
          target: heading,
          scrollContainer: window,
          top: 100,
        });
      }
    },

    getWikiHisDetail() {
      this.$http.get(`/wiki/wikiDetail/${this.wikiId}`).then((response) => {
        this.wikiHis = response.data.data;
        this.getMemberAuthority();
      });
    },

    selectWikiHisMembers() {
      this.$http.get(`/wiki/selectWikiHisMembers/${this.wikiId}`).then((response) => {
        this.wikiHisMembers = response.data.data;
      });
    },

    //권한관리 
    getMemberAuthority(){
      let data = this.$data;
      let request = {
        params: {
          menuId : data.wikiHis.menuId,
          authority : data.member.authority
        } 
      }
      this.$nextTick(function(){
        this.$http.get("/authority/getMemberWikiAuthority",request).then((response) => {
          this.memberAuthority = response.data.data;
          if(this.memberAuthority.viewYn != 1){
              this.authorityView = true;
              const secounds = 2;
              let num = 0;
              const timer = setInterval(()=>{
                if(num < secounds){
                  num ++;
                }else{
                  clearInterval(timer);
                  this.$router.go(-1);
                }
              },1000)
          }
        });
      })
    },

    getInfoCount() {
      this.$nextTick(function () {
        this.$http
          .get(`/wikiInfo/count/${this.wikiId}`)
          .then((response) => {
            this.wikiInfoCount = response.data.data;
          });
      });
    },

    saveHits() {
      this.$nextTick(function () {
        this.$http.post("/wikiInfo/save/hits", this.wikiInfo);
      });
    },

    saveLikes() {
      this.$nextTick(function () {
        this.$http
          .post("/wikiInfo/save/likes", this.wikiInfo)
          .then(() => {
            this.getMemberLikeAndCollect();
          });
      });
    },

    getMemberLikeAndCollect() {
      this.$nextTick(function () {
        this.$http
          .post("/wikiInfo/selectLikeAndCollectByMember", this.wikiInfo)
          .then((response) => {
            this.memberLikesAndCollect = response.data.data;
          });
      });
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

    //즐겨찾기 저장
    saveCollect(){
      this.wikiMemberMenusDialog = false;
      let params = {
        collectMenuId: this.selectWikiMenu,
        memberId: this.member.id,
        wikiId: this.wikiId
      }

      this.$http.post("/wikiCollect/collect/saveWikiCollect",params)
        .then((response) => {
          if(response.status == 200){
            this.getMemberLikeAndCollect();
          }
      })


    }

  },
};
</script>

<style>
</style>
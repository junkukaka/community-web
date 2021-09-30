<template>
  <v-card flat class="pb-12">
     <div style="margin: -10px 0 10px -10px">
      <!-- dashboard -->
      <dashboard-vue/>
    </div>
    <v-card flat class="mt-n3">
       <div class="text-overline font-weight-light pl-5 pt-2">
          last update:
          {{
            wikiHis.registerTime | date-format("yyyy-mm-dd hh:mi:ss")
          }}
        </div>
      <v-card-title class="text-h3 font-weight-medium pt-1">
        {{ wikiHis.title }}
      </v-card-title>

      <v-card-actions style="padding: 0px">
        <v-list-item class="grow" >
          <v-list-item-avatar  v-for="(member,id) in wikiHisMembers" :key="id">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attr }">
                <v-avatar size="43" v-if="member.picture"
                  v-bind="attr"
                  v-on="on"
                >
                  <img :src="member.picture" :alt="`photo`" />
                </v-avatar>
                <v-avatar color="#E0E0E0" v-if="!member.picture">
                  <v-icon dark class="mr-2" size="52"> mdi-account-circle </v-icon>
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
        <h6 class="text-h6 pb-1">Contents</h6>
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
      <v-btn fab dark small color="orange" @click="timeLineDialog = true">
        <v-icon>mdi-history</v-icon>
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
    wikiHisMembers: []
  }),

  created() {
    this.wikiId = this.$route.query.wikiId;
    this.member = this.$store.state.member;
    this.getWikiHisDetail();
    this.selectWikiHisMembers();
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

    getMemberAuthority(){
      let data = this.$data;
      let request = {
        params: {
          menuId : data.wikiHis.menuId,
          authority : data.member.authority
        } 
      }
      this.$http.get("/authority/getMemberWikiAuthority",request).then((response) => {
        this.memberAuthority = response.data.data;
        if(this.memberAuthority.viewYn != 1){
            this.$router.go(-1);
        }
      });

    }

  },
};
</script>

<style>
</style>
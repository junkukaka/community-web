<template>
  <v-card flat color="#F5F5F5">
    <v-card flat style="background-color: #F5F5F5">
        <v-card-title class="text-h2 font-weight-medium">
            {{wikiHis.title}}
        </v-card-title>
        <v-divider></v-divider>
        <div class="hisReview">
          <v-md-editor v-model="wikiHis.content" mode="preview" ref="editor" />
        </div>
         <!-- anchor -->
        <div class="anchorArea" v-if="titles.length > 0" v-show="$store.state.ifMobile">
          <h6 class="text-h6 pb-1">Contents</h6>
          <div style="" class="d-none ml-5 d-lg-block">
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

    <v-fab-transition>
        <v-btn
          color="indigo"
          large
          fab
          fixed
          @click="compareHis"
          style="right:30px;bottom:30px">
          <v-icon>mdi-format-list-bulleted-square</v-icon>
        </v-btn>
    </v-fab-transition>


    <!-- his compare dialog  -->
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="indigo">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{$t('setting')}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="confrimDialog = true">
                <v-icon class="mr-3">mdi-clock-time-ten-outline</v-icon>
                 {{$t('backToPast')}} 
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-row class="mt-1"> 
            <!-- history -->
            <v-col cols="12" md="6">
                <v-card flat style="background-color: #F5F5F5" >
                    <v-card-title class="text-h3 font-weight-medium">
                        History : {{wikiHis.title}}
                    </v-card-title>
                    <div class="hisReview">
                      <v-md-editor v-model="wikiHis.content" mode="preview" ref="editor" style="background-color: #F5F5F5"/>
                    </div>
                </v-card>
            </v-col>

            <!-- right now -->
            <v-col cols="12" md="6">
                <v-card flat>
                    <v-card-title class="text-h3 font-weight-medium">
                        Current : {{wikiNow.title}}
                    </v-card-title>
                    <v-md-editor v-model="wikiNow.content" mode="preview" ref="editor"/>
                </v-card>
            </v-col>
        </v-row>

      </v-card>
    </v-dialog>

    <!-- wikihis back to the past -->
    <v-dialog v-model="confrimDialog" max-width="360">
      <v-card>
        <v-card-title class="headline"
          >{{$t('msgBackToPast')}}</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="confrimDialog = false">
            {{$t('cancle')}}
          </v-btn>
          <v-btn color="indigo darken-1" text @click="backToThePast()">
            {{$t('ok')}} 
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>


<script>
export default {
  data() {
    return {
      dialog: false,
      confrimDialog: false,
      wikiHisId: null,
      contentsTitle: 0,
      titles: [],
      wikiHis:{},
      wikiNow:{}
    };
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

  created: function () {
    this.wikiHisId = this.$route.query.wikiHisId;
    this.initialize();
  },

  methods: {
      initialize(){
        this.$nextTick(function () {
            this.$http
            .get(`/wiki/wikiHis/${this.wikiHisId}`)
            .then((response) => {
                this.wikiHis = response.data.data;
            });
        });
      },

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
            top: 70,
          });
        }
      },

      compareHis(){
        this.dialog = true;
        this.$nextTick(function () {
            this.$http.get(`/wiki/wikiDetail/${this.wikiHis.wikiId}`).then((response) => {
                this.wikiNow = response.data.data;
            });
        });
      },

      backToThePast(){
        this.wikiHis.memberId = this.$store.state.member.id;
        this.$nextTick(function () {
            this.$http.put(`/wiki/backToTheHis`,this.wikiHis).then((response) => {
                this.confrimDialog= false;
                this.dialog = false;
            });
        });
      }
  }
};
</script>

<style>
.hisReview .v-md-editor__preview-wrapper .vuepress-markdown-body{
  background-color: #F5F5F5 !important ;
}
</style>
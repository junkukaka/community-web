<template>
  <v-card flat>
    <v-card flat>
      <v-card flat>
        <v-md-editor v-model="wikiHis.content" mode="preview" ref="editor" />
      </v-card>

      <!-- anchor -->
      <v-card
        flat
        style="
          position: fixed;
          right: 0px;
          top: 100px;
          width: 280px;
          border-left: 3px solid #e0e0e0;
        "
        class="pa-3 d-none d-lg-block"
      >
        <div
          v-for="(anchor, i) in titles"
          :key="i"
          :style="{ padding: `7px 0 7px ${anchor.indent * 19}px` }"
          @click="handleAnchorClick(anchor)"
        >
          <a style="cursor: pointer; color: #4a4a4ade">{{ anchor.title }}</a>
        </div>
      </v-card>
    </v-card>

    <!-- comment write area  -->
    <v-dialog v-model="dialog" width="700">
      <v-card> </v-card>
    </v-dialog>
    <!-- comment write area  end-->

    <!-- icon dial -->
    <v-speed-dial
      v-model="fab"
      right
      direction="top"
      open-on-hover
      transition="slide-y-reverse-transition"
      :style="{ position: 'absolute', top: `${scrollTop + 200}px` }"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-account-circle </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green" @click="commentDialog">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        :color="`${
          this.memberLikesAndCollect.memberCollectYn == 1 ? 'grey' : 'orange'
        }`"
        @click="saveCollect"
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
  </v-card>
</template>



<script>
export default {
  data: () => ({
    wikiId: null,
    wikiHis: {},
    titles: [],
    dialog: false,
    valid: true,
    fab: false,
    scrollTop: 0,
  }),

  created(){
      this.wikiId = this.$route.query.id;
  },

  mounted() {
    window.addEventListener("scroll", this.scrollHandle); //绑定页面滚动事件
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
          indent: hTags.indexOf(el.tagName),
        }));
      });

      //由于网页加载可能有延迟，导航加载时间会出现延迟。
      if (br.length > 0) {
        console.log(`${i} ---- ${br.length}`);
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
      const heading = editor.$el.querySelector(
        `.v-md-editor-preview [data-v-md-line="${lineIndex}"]`
      );

      if (heading) {
        editor.previewScrollToTarget({
          target: heading,
          scrollContainer: window,
          top: 60,
        });
      }
    },

    scrollHandle(e) {
      this.scrollTop = e.srcElement.scrollingElement.scrollTop; // 获取页面滚动高度
      //console.log(this.scrollTop);
    },

    getWikiHisDetail() {
      this.$nextTick(function () {
        this.$http.get(`/wiki/wikiDetail/${this.wikiId}`).then((response) => {
          this.wikiHis = response.data.data;
        });
      });
    },
  },
};
</script>

<style>
#read .ql-syntax {
  background-color: rgb(236, 236, 236);
  padding: 10px;
}
#read p img {
  max-width: 100%;
}
.v-application a {
  text-decoration: none;
}
</style>
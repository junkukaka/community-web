<template>
  <v-card flat>
    <v-card flat>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-2" style="color: rgba(0, 0, 0, 0.6)">
            {{
              community.registerTime | date-format("yyyy-mm-dd hh:mi:ss")
            }}
          </div>
          <v-list-item-title class="headline mb-3 text-h4">
            {{ community.title }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <span class="mr-3"> {{ comInfoCount.hitsCount }} Views</span>
            <span class="mr-3"> {{ comInfoCount.collectCount }} Comments</span>
            <span class="mr-3"> {{ comInfoCount.likesCount }} liks</span>
            <span class="mr-3"> {{ comInfoCount.collectCount }} collect</span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions style="padding: 0px">
        <v-list-item class="grow">
          <v-list-item-avatar>
            <v-img class="elevation-6" alt="" :src="community.picture"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title> {{ community.memberName }} </v-list-item-title>
          </v-list-item-content>

          <v-row align="center" justify="end">
            <span>
              <v-icon class="mr-2"> mdi-domain </v-icon>
              <span class="subheading mr-2">: {{ community.department }}</span>
            </span>
          </v-row>
        </v-list-item>
      </v-card-actions>

      <v-divider class="ml-3"></v-divider>
      <!-- v-mditor start  -->
      <!-- preview -->
     
        <v-card flat>
          <v-md-editor
            v-model="community.content"
            mode="preview"
            ref="editor"
          />
        </v-card>

        <!-- anchor -->
        
        <v-card
          flat
          style="position: fixed; right: 0px; top: 100px; width: 250px; border-left:3px solid #e0e0e0;"
          class="pa-3 d-none d-lg-block"
        >
          <div
            v-for="(anchor, i) in titles"
            :key="i"
            :style="{ padding: `7px 0 7px ${anchor.indent * 19}px` }"
            @click="handleAnchorClick(anchor)"
          >
            <a style="cursor: pointer;color:#4a4a4ade" >{{ anchor.title }}</a>
          </div>
        </v-card>
      
      <v-divider></v-divider>
      <!-- v-mditor end  -->
    </v-card>

    <!-- comment write area  -->
    <v-dialog v-model="dialog" width="700">
      <v-card>
        <v-card-title>댓글등록</v-card-title>
        <v-card-text style="padding-bottom: 0px">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-textarea
              outlined
              label="Add a Comment"
              value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
              v-model="comment.content"
              :rules="commentRules"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="commentSave">
            <v-icon>mdi-pencil</v-icon> Write
          </v-btn>
          <v-btn color="orange" text @click="commentDialog"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- comment write area  end-->

    <!-- comment list area -->
    <v-card flat>
      <div class="transition-swing text-h5 mb-1 mt-10 ml-3">Comments list</div>
      <v-divider class="ml-3"></v-divider>
      <v-list>
        <template v-for="(item, index) in commentList">
          <v-divider
            v-if="item.divider"
            :key="index"
            :inset="item.inset"
          ></v-divider>
          <v-list-item v-else :key="index">
            <v-list-item-avatar>
              <v-img :src="item.picture"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ item.member_name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.content }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-subtitle>
                {{ item.register_time | date-format("yyyy-mm-dd") }}
              </v-list-item-subtitle>
              <v-list-item-subtitle> </v-list-item-subtitle>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-card>

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
import { mapGetters } from "vuex";

export default {
  data: () => ({
    community: {},
    titles: [],
    dialog: false,
    valid: true,
    fab: false,
    scrollTop: 0,
    comment: {
      userId: null,
      communityId: null,
      content: "",
    },
    commentRules: [
      (v) => !!v || "comment is required",
      (v) =>
        (v && v.length <= 200) || "comment must be less than 200 characters",
    ],
    commentList: [],
    commentCount: null,
    comInfo: {
      communityId: null,
      memberId: null,
    },
    memberLikesAndCollect: {},
    comInfoCount: {
      hitsCount: 0,
      likesCount: 0,
      collectCount: 0,
      commentCount: 0,
    },
  }),

  created() {
    this.community.id = this.$route.query.id;
    //comment
    this.comment.communityId = this.$route.query.id;
    this.comment.memberId = this.getMember().id; //用户ID 赋值
    //comInfo
    this.comInfo.communityId = this.$route.query.id;
    this.comInfo.memberId = this.getMember().id; //用户ID 赋值
    this.scrollTop = document.documentElement.scrollTop;
    this.getCommunity();
    this.getComments();
    this.saveHits();
    this.getInfoCount();
    this.getMemberLikeAndCollect(); //member like or collected this community

    
  },

  
  mounted() {
    window.addEventListener("scroll", this.scrollHandle); //绑定页面滚动事件

    let br; 
    let i = 0;
    //try 10s
    while(i < 7){
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
      })

      //由于网页加载可能有延迟，导航加载时间会出现延迟。
      if(br.length > 0){
        console.log(`${i} ---- ${br.length}`);
        break;
      }

      i++;
    }

    
  },

  methods: {
    ...mapGetters(["getMember"]),

    sleep (time) {
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

    getCommunity() {
      //community select
      this.$http
        .get(`/community/communitys/${this.community.id}`)
        .then((response) => {
          this.community = response.data.data;
        });
    },

    getMemberLikeAndCollect() {
      this.$nextTick(function () {
        this.$http
          .post("/comInfo/selectLikeAndCollectByMember", this.comInfo)
          .then((response) => {
            this.memberLikesAndCollect = response.data.data;
          });
      });
    },

    //comment select
    getComments() {
      this.commentList = [];
      this.$nextTick(function () {
        this.$http
          .get(`/comment/comments/${this.community.id}`)
          .then((response) => {
            const comments = response.data.data.list;
            this.commentCount = response.data.data.count;
            //下划线处理
            for (let i = 0; i < comments.length; i++) {
              this.commentList.push(comments[i]);
              this.commentList.push({ divider: true, inset: true });
            }
          });
      });
    },

    //community info commont,likes,collect,hits count select
    getInfoCount() {
      this.$nextTick(function () {
        this.$http
          .get(`/comInfo/count/${this.community.id}`)
          .then((response) => {
            this.comInfoCount = response.data.data;
          });
      });
    },

    //comment save
    commentSave() {
      const val = this.$refs.form.validate(); // 验证
      if (val) {
        this.$http.post("/comment/comments", this.comment).then((response) => {
          //请求成功
          if (response.data.data === 1) {
            this.commentDialog();
          }
        });
      }
    },

    saveHits() {
      this.$nextTick(function () {
        this.$http.post("/comInfo/save/hits", this.comInfo);
      });
    },

    saveLikes() {
      this.$nextTick(function () {
        this.$http
          .post("/comInfo/save/likes", this.comInfo)
          .then((response) => {
            this.getMemberLikeAndCollect();
          });
      });
    },

    saveCollect() {
      this.$nextTick(function () {
        this.$http
          .post("/comInfo/save/collect", this.comInfo)
          .then((response) => {
            this.getMemberLikeAndCollect();
          });
      });
    },

    //comment dialog switch
    commentDialog() {
      this.dialog = !this.dialog;
      this.getComments();
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
<template>
  <v-card flat>
    <v-card flat>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-2" style="color: rgba(0, 0, 0, 0.6)">
            {{community.registerTime | date-format('yyyy-mm-dd hh:mi:ss')}}
          </div>
          <v-list-item-title class="headline mb-3 text-h4">
            {{ community.title }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <span class="mr-3"> {{comInfoCount.hitsCount}} Views</span>
            <span class="mr-3"> {{comInfoCount.collectCount}} Comments</span>
            <span class="mr-3"> {{comInfoCount.likesCount}} liks</span>
            <span class="mr-3"> {{comInfoCount.collectCount}} collect</span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions style="padding: 0px">
        <v-list-item class="grow">
          <v-list-item-avatar>
            <v-img
              class="elevation-6"
              alt=""
              :src="community.picture"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title> {{community.memberName}} </v-list-item-title>
          </v-list-item-content>

          <v-row align="center" justify="end">
            <span>
              <v-icon class="mr-2"> mdi-domain </v-icon>
              <span class="subheading mr-2">: {{community.department}}</span>
            </span>
          </v-row>
        </v-list-item>
      </v-card-actions>

      <v-divider class="mb-7 ml-3"></v-divider>
      <div
        id="read"
        class="text-justify mb-3 ml-3"
        v-html="community.content"
      ></div>
      <v-divider></v-divider>
    </v-card>

    <!-- comment write area  -->
    <v-card flat>
      <v-card flat class="mt-5">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-textarea
            outlined
            label="Add a Comment"
            value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
            v-model="comment.content"
            :rules="commentRules"
          ></v-textarea>
        </v-form>
        <div class="clearfix">
          <v-btn
            color="primary"
            depressed
            @click="commentSave"
            class="float-right"
            dark
          >
            <v-icon>mdi-pencil</v-icon> 댓글</v-btn
          >
        </div>
      </v-card>

      <!-- pop -->
      <v-dialog v-model="dialog" width="360">
        <v-card>
          <v-card-title style="">댓글등록</v-card-title>
          <v-card-actions>
            <v-btn color="primary" text @click="closeCommentAlert">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>

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
      <v-btn fab dark small 
        :color="`${this.memberLikesAndCollect.memberCollectYn == 1 ? 'grey' : 'green'}`" 
        @click="saveCollect">
        <v-icon>mdi-star</v-icon>
      </v-btn>
      <v-btn fab dark small 
        :color="`${this.memberLikesAndCollect.memberLikesYn == 1 ? 'grey' : 'red'}`"
      @click="saveLikes">
        <v-icon>mdi-thumb-up</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-card>
</template>

  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    community: {},
    dialog: false,
    valid: true,
    fab: false,
    scrollTop: 0,
    comment: {
      userId: null,
      communityId: null,
      content: ""
    },
    commentRules: [
      (v) => !!v || "comment is required",
      (v) =>
        (v && v.length <= 200) || "comment must be less than 200 characters",
    ],
    commentList: [],
    commentCount: null,
    comInfo:{
      communityId: null,
      memberId: null
    },
    memberLikesAndCollect:{},
    comInfoCount:{
      hitsCount: 0,
      likesCount: 0,
      collectCount: 0,
      commentCount: 0
    }
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
  },

  methods: {
    ...mapGetters(["getMember"]),

    scrollHandle(e) {
      this.scrollTop = e.srcElement.scrollingElement.scrollTop; // 获取页面滚动高度
      //console.log(this.scrollTop);
    },

    getCommunity() {
      //community select
      this.$nextTick(function () {
        this.$http
          .get(`/community/communitys/${this.community.id}`)
          .then((response) => {
            this.community = response.data.data;
          });
      });
    },

    getMemberLikeAndCollect(){
      this.$nextTick(function(){
        this.$http
          .post("/comInfo/selectLikeAndCollectByMember",this.comInfo)
          .then((response) => {
            this.memberLikesAndCollect = response.data.data
          })
      })
    },

    //comment select
    getComments() {
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
    getInfoCount(){
      this.$nextTick(function(){
        this.$http.get(`/comInfo/count/${this.community.id}`)
        .then((response) => {
          this.comInfoCount = response.data.data
        })
      })
    },

    //comment save
    commentSave() {
      const val = this.$refs.form.validate(); // 验证
      if (val) {
        this.$http.post("/comment/comments", this.comment).then((response) => {
          //请求成功
          if (response.data.data === 1) {
            //comment reset
            this.comment.content = "";
            this.dialog = true;
          }
        });
      }
    },

    saveHits(){
      this.$nextTick(function(){
        this.$http.post("/comInfo/save/hits",this.comInfo)
      })
    },

    saveLikes(){
      this.$nextTick(function(){
        this.$http.post("/comInfo/save/likes",this.comInfo).then(
          (response) => {this.getMemberLikeAndCollect();}
        )
      })
    },

    saveCollect(){
      this.$nextTick(function(){
        this.$http.post("/comInfo/save/collect",this.comInfo).then(
          (response) => {this.getMemberLikeAndCollect();}
        )
      })
    },

    //close comment alert 
    closeCommentAlert(){
      this.commentList = []
      this.getComments();
      this.reset();
      this.dialog = false;
      this.getComments();
    },
    //comment
    reset() {
      this.$refs.form.reset();
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
<template>
  <v-card flat>
    <!-- 권한관리 메세지  -->
    <v-alert
      shaped
      prominent
      type="error"
      v-if="authorityView"
    >
      {{$t('authorityBanMSG')}}
    </v-alert> 


    <div style="margin: -10px 0 0">
      <!-- dashboard -->
      <dashboard-vue />
    </div>

    <v-card flat>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline font-weight-light">
            {{
              community.registerTime | date-format("yyyy-mm-dd hh:mi:ss")
            }}
          </div>
          <v-list-item-title class="headline mb-3 text-h3">{{
            community.title
          }}</v-list-item-title>
          <v-list-item-subtitle class="text-overline font-weight-regular">
            <span class="mr-3"> {{ comInfoCount.hitsCount }} {{$t('views')}}</span>
            <span class="mr-3"> {{ comInfoCount.commentCount }} {{$t('comments')}} </span>
            <span class="mr-3"> {{ comInfoCount.likesCount }} {{$t('likes')}}</span>
            <span class="mr-3"> {{ comInfoCount.collectCount }} {{$t('collect')}}</span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions style="padding: 0px">
        <v-list-item class="grow">
          <v-list-item-avatar>

            <router-link :to="'/targetMember?memberId=' + community.memberId">
              <v-avatar size="43" v-if="community.picture">
                <img :src="community.picture" :alt="`photo`" />
              </v-avatar>
              <v-avatar color="#E0E0E0" v-if="!community.picture">
                <v-icon dark class="mr-2" size="52"> mdi-account-circle </v-icon>
              </v-avatar>
            </router-link>
            <!-- <v-img class="elevation-6" alt="" :src="community.picture" v-if="community.picture != null"></v-img> -->
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              {{ community.memberName }}
            </v-list-item-title>
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
        <v-md-editor v-model="community.content" mode="preview" ref="editor" />
      </v-card>

      <!-- anchor -->
      <div
        class="anchorArea d-none d-lg-block"
        v-if="titles.length > 0"
        v-show="$store.state.ifMobile"
      >
        <h6 class="text-h6 pb-1">{{$t('catalogue')}}</h6>
        <div style="" class="ml-3 anchorAreaBox">
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
            <a> {{ anchor.title }} {{ anchor.top }} </a>
          </div>
        </div>
      </div>
      <!-- anchor  end -->

      <v-divider></v-divider>
      <!-- v-mditor end  -->
    </v-card>

    <!-- comment write area  -->
    <v-dialog v-model="dialog" width="700">
      <v-card>
        <v-card-title>{{$t('commentWrite')}}</v-card-title>
        <v-card-text style="padding-bottom: 0px">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-textarea
              outlined
              :label="$t('addComment')"
              value=""
              v-model="comment.content"
              :rules="commentRules"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="indigo" text @click="commentSave" :disabled = commentSaveFlag>
            <v-icon>mdi-pencil</v-icon> {{$t('ok')}}
          </v-btn>
          <v-btn color="orange" text @click="commentDialog"> {{$t('close')}} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- comment write area  end-->

    <files-list-vue v-bind:parent="filesObj" />

    <!-- comment list area -->
    <v-card flat>
      <div class="transition-swing text-h5 mb-1 mt-10 ml-3">{{$t('commentsList')}}</div>
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
              <v-list-item-title>{{ item.member_name }}</v-list-item-title>
              <v-list-item-subtitle>
                  {{ formatContent(item.content) }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-subtitle style="max-height:19px">
                {{ item.register_time | date-format("yyyy-mm-dd") }}
              </v-list-item-subtitle>
          
              <v-list-item-subtitle v-if="item.memberId == member.id">
                 <v-btn
                    x-small
                    color="indigo"
                    dark
                    class="mr-1"
                    @click="editComment(item)"
                  >
                     <v-icon x-small dark>
                        mdi-wrench
                      </v-icon>
                  </v-btn>
                  <v-btn
                    x-small
                    color="secondary"
                    dark
                    @click="openDeleteCommentDialog(item.id)"
                  >
                    X
                  </v-btn>
              </v-list-item-subtitle>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-card>

    <!-- 댓글삭제 확인 -->
    <v-dialog
      v-model="commentDeleteConfirmDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
           {{$t('deleteCommentTitle')}}
        </v-card-title>
        <v-card-text>
           {{$t('deleteCommentDescription')}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="deleteComment"
          >
            {{$t('ok')}}
          </v-btn>
          <v-btn
            color="orange"
            text
            @click="commentDeleteConfirmDialog = false"
          >
            {{$t('close')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- icon dial -->
    <v-speed-dial
      v-model="fab"
      right
      direction="top"
      open-on-hover
      transition="slide-y-reverse-transition"
      fixed
      class="rightBottomArea"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="indigo" dark fab elevation = 0>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-account-circle </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small depressed color="green" @click="commentDialog">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        depressed
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
        depressed
        :color="`${
          this.memberLikesAndCollect.memberLikesYn == 1 ? 'grey' : 'red'
        }`"
        @click="saveLikes"
      >
        <v-icon>mdi-thumb-up</v-icon>
      </v-btn>

      <v-btn
        v-if="community.memberId === $store.state.member.id"
        fab
        dark
        small
        depressed
        color="indigo"
        @click="editMyCommunity"
      >
        <v-icon>mdi-wrench</v-icon>
      </v-btn>

      <router-link target="_blank" :to="'/pdf/community?id=' + community.id">
        <v-btn
          fab
          dark
          small
          depressed
          color="indigo"
        >
          <v-icon>mdi-file-pdf</v-icon>
        </v-btn>
      </router-link>

    </v-speed-dial>
  </v-card>
</template>



<script>
import { mapGetters } from "vuex";
import DashboardVue from "../com/Dashboard";
import FilesListVue from "../com/FilesList";

export default {
  components: { DashboardVue, FilesListVue },

  data: () => ({
    community: {},
    titles: [],
    dialog: false,
    valid: true,
    fab: false,
    comment: {
      memberId: null,
      communityId: null,
      content: "",
      id: null
    },
    member: {},
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
    contentsTitle: 0,
    filesObj: {
      id: null,
      flag: "C",
    },
    authorityView : false,
    commentDeleteConfirmDialog: false,
    deleteCommentId : null,
    commentSaveFlag : false
  }),

  computed: {
    commentRules(){
      return [
          (v) => !!v || this.$t('required', {0: this.$t('comments')}),
          (v) =>
            (v && v.length <= 3000) || this.$t('lessThan',{0:3000})
        ]
    }
  },

  created() {
    this.community.id = this.$route.query.id;
    //comment
    this.comment.communityId = this.$route.query.id;
    this.filesObj.id = this.$route.query.id;
    //comInfo
    this.comInfo.communityId = this.$route.query.id;
    this.member = this.$store.state.member;

    this.scrollTop = document.documentElement.scrollTop;
    this.getCommunity();
    this.getComments();
    this.saveHits();
    this.getInfoCount();
    this.getMemberLikeAndCollect(); //member like or collected this community
    this.setMemberId();
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
          indent: hTags.indexOf(el.tagName),
        }));
      });

      //由于网页加载可能有延迟，导航加载时间会出现延迟。
      if (br.length > 0) {
        break;
      }

      i++;
    }
  },

  methods: {
    ...mapGetters(["getMember"]),

    formatContent(content) {
      return content.split('\n').join('<br/>');
    },

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },

    setMemberId() {
      this.comment.memberId = this.getMember().id; //用户ID 赋值
      this.comInfo.memberId = this.getMember().id; //用户ID 赋值
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

    getCommunity() {
      //community select
      this.$http
        .get(`/community/communities/${this.community.id}`)
        .then((response) => {
          this.community = response.data.data;
          document.title = this.community.title;
          this.getMemberAuthority();
          //如果是会员本人看就执行
          if (this.community.memberId == this.member.id) {
            this.readComment(this.community);
          }
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
        this.commentSaveFlag = true;
        this.$http.post("/comment/comments", this.comment).then((response) => {
          //请求成功
          if (response.data.code == 200 ) {
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
      this.commentSaveFlag = !this.dialog;
      this.comment.id = null,
      this.comment.content = "",
      this.getComments();
    },

    //to the my community edit
    editMyCommunity() {
      this.$router.push(
        `/community/communityEdit?menuId=${this.community.menuId}&id=${this.community.id}`
      );
    },

    readComment(item) {
      this.$nextTick(function () {
        this.$http.put(`/comment/readComment/${item.id}`).then(() => {
          this.getCommunityComment();
        });
      });
    },

    //如果是本人，就更新notification
    getCommunityComment() {
      this.$nextTick(function () {
        this.$http
          .get(`/comment/getMyCommunityCommentCount/${this.member.id}`)
          .then((response) => {
            this.$store.state.memberAlert = response.data.data;
          });
      });
    },


    //권한관리 
    getMemberAuthority(){
      let data = this.$data;
      let request = {
        params: {
          menuId : data.community.menuId,
          authority : data.member.authority
        } 
      }
      this.$nextTick(function(){
        this.$http.get("/authority/getMemberCommunityAuthority",request).then((response) => {
          if(response.data.data.viewYn != 1){
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

    //댓글 삭제 확인 팝업 
    openDeleteCommentDialog(id){
      this.commentDeleteConfirmDialog = true;
      this.deleteCommentId = id;
    },

    //댓글 삭제 액션
    deleteComment(){
      this.$nextTick(function () {
        this.$http
          .delete(`/comment/delete/${this.deleteCommentId}`)
          .then((response) => {
            this.commentDeleteConfirmDialog = false;
            this.deleteCommentId = null;
            this.getComments();
          });
      });
    },

    //댓글 편집 
    editComment(item){
      console.log(item);
      this.dialog = true;
      this.commentSaveFlag = false;
      this.comment.id = item.id;
      this.comment.content = item.content;
      this.comment.memberId = item.memberId;
      console.log(this.comment)
    }


  },
};
</script>

<style>
</style>
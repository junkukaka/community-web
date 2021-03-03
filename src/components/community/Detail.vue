<template>
  <v-card flat>
    <v-card flat >
        <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-2" style="color: rgba(0, 0, 0, 0.6)">
                {{community.registerTime | date-format('yyyy-mm-dd hh:mi:ss')}}
                </div>
                <v-list-item-title class="headline mb-3 text-h4">
                {{ community.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                <span class="mr-3"> 100 liks</span>
                <span class="mr-3"> 648 Views</span>
                <span class="mr-3"> {{commentCount}} Comments</span>
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-card-actions style="padding: 0px">
        <v-list-item class="grow">
            <v-list-item-avatar color="grey darken-3">
            <v-img
                class="elevation-6"
                alt=""
                src="https://cdn.vuetifyjs.com/images/lists/1.jpg"
            ></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
            <v-list-item-title> 남광준 </v-list-item-title>
            </v-list-item-content>

            <v-row align="center" justify="end">
              <router-link :to="`/communityEdit?id=${community.id}`">
                  <v-icon class="mr-2">mdi-pencil</v-icon>
                  <span class="subheading mr-2">수정</span>
              </router-link>
              <span>
                    <v-icon class="mr-2"> mdi-domain </v-icon>
                    <span class="subheading mr-2">: 운영팀</span>
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
            @blur="reset"
          ></v-textarea>
        </v-form>
        <v-btn color="primary" depressed  @click="commentSave"
          dark >
          <v-icon>mdi-pencil</v-icon>
          댓글
        </v-btn>
      </v-card>

      <!-- pop -->
      <v-dialog v-model="dialog" width="360">
        <v-card>
          <v-card-title style="">댓글등록</v-card-title>
          <v-card-actions>
            <v-btn color="primary" text @click="dialog = false">Close</v-btn>
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
            <v-list-item
               v-else
              :key="index"
            >
              <v-list-item-avatar>
                <v-img :src="item.picture"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{item.user_name}}</v-list-item-title>
                <v-list-item-subtitle>{{item.content}}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-subtitle>
                  {{item.register_time|date-format('yyyy-mm-dd')}}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
               
                </v-list-item-subtitle>
              </v-list-item-action>
              
            </v-list-item>
          </template>
        </v-list>
    </v-card>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    community: {
      id: "",
      title: "",
      content: "",
      menuId: "",
    },
    dialog: false,
    valid: true,
    comment: {
      userId: null,
      communityId: null,
      content: "",
      reply_user_id: null
    },
    commentRules: [
      (v) => !!v || "comment is required",
      (v) => (v && v.length <= 200) || "comment must be less than 200 characters",
    ],
    commentList: [],
    commentCount: null,
  }),

  created() {
    this.community.id = this.$route.query.id;
    this.comment.communityId = this.$route.query.id;
    this.comment.userId = this.getUser().id; //用户ID 赋值
    this.getCommunity();
    this.getComments();
  },

  methods: {
    ...mapGetters(["getUser"]),

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

    //댓글 조회
    getComments() {
      this.$nextTick(function () {
        this.$http
          .get(`/comment/comments/${this.community.id}`)
          .then((response) => {
            const comments = response.data.data.list;
            this.commentCount = response.data.data.count;
            //下划线处理
            for(let i = 0; i < comments.length ; i++){
              this.commentList.push(comments[i])
              this.commentList.push({divider: true, inset: true })
            }
          });
      });
    },

    //comment save
    commentSave(){
      const val = this.$refs.form.validate(); // 验证
      if(val){
        this.$http
          .post("/comment/comments",this.comment)
          .then(response => {
            //请求成功
            if(response.data.data === 1){
              //comment reset
              this.comment.content = "";
              this.dialog = true;
            }
          });
      }
    },

    //comment 
    reset () {
        this.$refs.form.reset()
    },
  },
};
</script>

<style>
#read .ql-syntax {
  background-color: rgb(236, 236, 236);
  padding: 10px;
}
.v-application a{
    text-decoration: none;
}
</style>
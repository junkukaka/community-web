<template>
   <v-card flat class="">
     <v-data-table
      v-model="selected"
      :headers="headers"
      :items="memberApp"
      :select-strategy="singleSelect ? 'single' : 'page'"
      hide-default-footer
      item-value="id"
      show-select
      class="elevation-1"
    >
      <template v-slot:top>
        <v-switch
          v-model="singleSelect"
          label="Single select"
          class="pa-3"
        ></v-switch>
      </template>
    </v-data-table>

    <v-card style="height:100px">
      <v-card flat style="position:fixed; bottom:70px; right: 30px">
        <v-btn
          size="large"
          variant="flat"
          color="indigo"
          class="mt-3 text-white"
          @click="joinMember"
          :disabled="!joinDisabled"
        >
          회원가입
          <v-icon end>mdi-account-check </v-icon>
        </v-btn>
        <v-btn
          size="large"
          variant="flat"
          color="grey-darken-3"
          class="mt-3 ml-5 text-white"
          @click="deleteJoinMember"
        >
          신청 삭제
          <v-icon end>mdi-account-cancel-outline </v-icon>
        </v-btn>
      </v-card>
    </v-card>
    <pop-msg-dialog v-bind:parent="popMsg"/>
  </v-card>
</template>

<script>
  import PopMsgDialog from "../../../components/com/PopMsgDialog.vue";
  export default {
    components: {
      PopMsgDialog
    },

    data () {
      return {
        singleSelect: false,
        selected: [],
        joinDisabled: true,
        headers: [
          {
            title: 'Name',
            align: 'start',
            key: 'memberName',
          },
          { title: 'Login Id', key: 'loginId' },
          { title: '소속', key: 'department' },
          { title: 'Email', key: 'email' },
          { title: '신청일자', key: 'registerTime' },
          { title: '신청사유', key: 'comment' },
        ],
        memberApp: [],
        popMsg: {
          dialog: false,
          content: null,
          title: null
        },
      }
    },

    created(){
      this.initialize();
    },

    methods: {
      initialize(){
        this.$http.get("/member/getAllAppMember")
        .then((response) =>{
          this.memberApp = response.data.data;
        })
      },

      //会员加入
      joinMember(){
        let request = [];
        if(this.selected.length === 0){
            this.popMsg.dialog = true;
            this.popMsg.title = "에러 메세지";
            this.popMsg.content = "선택한 내용이 없습니다.";
            return false;
        }
        for(let select of this.selected){
          request.push(select.id);
        }
        this.joinDisabled = false;
        this.$http.post("/member/appMemberToRealMember",request)
          .then((response) => {
            this.initialize();
            this.joinDisabled = true;
        }).catch((error) => {
            this.popMsg.dialog = true;
            this.popMsg.title = "에러 메세지";
            this.popMsg.content = "수정 실패";
            this.joinDisabled = true;
        })
      },

      deleteJoinMember(){
        let request = [];
        if(this.selected.length === 0){
            this.popMsg.dialog = true;
            this.popMsg.title = "에러 메세지";
            this.popMsg.content = "선택한 내용이 없습니다.";
            return false;
        }
        for(let select of this.selected){
          request.push(select.id);
        }
        this.$http.post("/member/appMemberDelete",request)
          .then((response) => {
            this.initialize();
        }).catch((error) => {
            this.popMsg.dialog = true;
            this.popMsg.title = "에러 메세지";
            this.popMsg.content = "수정 실패";
        })
      }


    }
  }
</script>

<template>
   <v-card flat class="">
     <v-data-table
      v-model="selected"
      :headers="headers"
      :items="memberApp"
      :single-select="singleSelect"
      hide-default-footer
      item-key="id"
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
          large
          depressed
          color="primary"
          class="mt-3 white--text"
          @click="joinMember"
          :disabled="!joinDisabled"
        >
          회원가입 
          <v-icon right dark>mdi-account-check </v-icon>
        </v-btn>
        <v-btn
          large
          depressed
          color="grey darken-3"
          class="mt-3 ml-5 white--text"
          @click="deleteJoinMember"
        >
          신청 삭제 
          <v-icon right dark>mdi-account-cancel-outline </v-icon>
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
            text: 'Name',
            align: 'start',
            value: 'memberName',
          },
          { text: 'Login Id', value: 'loginId' },
          { text: '소속', value: 'department' },
          { text: 'Email', value: 'email' },
          { text: '신청일자', value: 'registerTime' },
          { text: '신청사유', value: 'comment' },
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
<template>
  <v-card flat class="pa-2">

    <v-card flat color="grey lighten-4" class="mb-5">
      <v-toolbar flat color="indigo">
        <v-toolbar-title class="font-weight-light white--text">
          회원 검색 
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          append-icon="mdi-magnify"
          label="사용자 이름"
          single-line
          hide-details
          class="mb-3 pb-3"
          v-model="searchMemberName"
          @keyup.native.enter="initialize"
        ></v-text-field>

        <v-row>
          <v-col
            class="d-flex"
            cols="12"
            sm="6"
          >
            <v-select
              :items="authorities"
              label="권한"
              outlined
              item-text="name"
              item-value="id"
              v-model="searchAuthority"
              clearable 
            ></v-select>
          </v-col>

          <v-col
            class="d-flex"
            cols="12"
            sm="6"
          >
            <v-select
              :items="departments"
              label="departments"
              outlined
              v-model="searchDepartment"
              clearable
            ></v-select>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="indigo" @click="searchAllMemberByAdmin" class="white--text"> 
            <v-icon left>
              mdi-update
            </v-icon>
             Search
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>

    <v-data-table
      flat
      :headers="headers"
      :items="members"
      :disable-pagination="disablePagination"
      class="elevation-1 mytable"
      hide-default-footer
    >
      <!-- <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Member List</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template> -->

      <template v-slot:[`item.memberName`]="{ item }">
        <v-btn text color="indigo" @click="editMember(item)">
          {{ item.memberName }}
        </v-btn>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-btn text color="indigo" @click="editMember(item)">
          {{ item.status }}
        </v-btn>
      </template>
    </v-data-table>

    <!-- dialog start -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title> User Profil </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Memeber Name"
                  v-model="member.memberName"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Login ID"
                  disabled
                  v-model="member.loginId"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  :items="departments"
                  label="departments"
                  outlined
                  v-model="member.department"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  :items="statuses"
                  label="status"
                  outlined
                  v-model="member.status"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="member.authority"
                  :items="authorities"
                  item-text="name"
                  item-value="id"
                  outlined
                  label="권한 관린"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="iniPassword">
            비밀번호 초기화
          </v-btn>
          <v-btn color="blue darken-1" text @click="updateMember"> Save </v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialog end -->

    <v-card flat class="mt-5">
      <template>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="pages"
            :total-visible="7"
          ></v-pagination>
        </div>
      </template>
    </v-card>

    <pop-msg-dialog v-bind:parent="popMsg" />
  </v-card>
</template>

<script>
import PopMsgDialog from "../../../components/com/PopMsgDialog.vue";

const PAGE = 1;
const PERPAGE = 30;

export default {
  components: {
    PopMsgDialog,
  },

  data: () => ({
    member: {
      id: null,
      memberName: null,
      status: null,
      loginId: null,
      department: null,
      departmentName: null,
      authority: null,
    },
    statuses: [
      { value: "ON", text: "ON" },
      { value: "OFF", text: "OFF" },
    ],
    page: PAGE,
    itemsPerPage: PERPAGE,
    pages: 1,
    members: [],
    dialog: false,
    disablePagination: true,
    departments: [],
    headers: [
      { text: "Name", align: "start", value: "memberName" },
      { text: "상태", value: "status" },
      { text: "login id", value: "loginId" },
      { text: "권한", value: "authorityName" },
      { text: "department", value: "departmentName" },
      { text: "가입일자", value: "registerTime" },
      { text: "등록일자", value: "updateTime" },
    ],
    popMsg: {
      dialog: false,
      content: null,
      title: null,
    },
    authorities: [],
    searchMemberName: null,
    searchAuthority: null,
    searchDepartment: null,
  }),


  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
    this.getAuthorities();
  },

  watch: {
    page: function () {
      this.initialize();
    },
  },

  methods: {
    initialize() {
      this.getAllMemberByAdmin();
      this.$nextTick(function () {
        this.$http
          .get("/member/members/department")
          .then((response) => (this.departments = response.data.data));
      });
    },

    //검색
    searchAllMemberByAdmin(){
      this.page = PAGE,
      this.itemsPerPage = PERPAGE,
      console.log(`authority is ${this.searchAuthority} ------ department is ${this.searchDepartment}`);
      this.getAllMemberByAdmin();
    },

    //회원정보 전체 조회 
    getAllMemberByAdmin(){
      let request = {
        params: {
          memberName: this.searchMemberName,
          page: this.page,
          itemsPerPage: this.itemsPerPage,
          authority: this.searchAuthority,
          department: this.searchDepartment
        },
      };

      this.$nextTick(function () {
        this.$http
          .get("/member/members/getAllMemberByAdmin",request)
          .then((response) => {
            this.members = response.data.data.members;
            this.page = response.data.data.page; //当前页面
            this.pages = response.data.data.pages; //页数
          });
      });
    },

    getAuthorities() {
      this.$nextTick(function () {
        this.$http.get("/authority/getAuthority").then((response) => {
          this.authorities = response.data.data;
        });
      });
    },

    //회원조회 dialog open
    editMember(item) {
      this.dialog = true;
      this.member.id = item.id;
      this.member.loginId = item.loginId;
      this.member.memberName = item.memberName;
      this.member.department = item.department;
      this.member.departmentName = item.departmentName;
      this.member.authority = item.authority;
      this.member.status = item.status;
    },

    //비밀번호 초기화
    iniPassword() {
      this.$nextTick(function () {
        this.$http
          .put("/member/iniPassword",this.member)
          .then((response) => {
            if (response.data.code == 200) {
              this.dialog = false;
              this.initialize();
            } else {
              this.updateError();
            }
          })
          .catch((error) => {
            this.updateError();
          });
      });
    },

    //회원수정
    updateMember() {
      this.dialog = false;
      this.$nextTick(function () {
        this.$http
          .put("/member/members", this.member)
          .then((response) => {
            if (response.data.code == 200) {
              this.initialize();
            } else {
              this.updateError();
            }
          })
          .catch((error) => {
            this.updateError();
          });
      });
    },

    updateError() {
      this.popMsg.dialog = true;
      this.popMsg.title = "Error Message";
      this.popMsg.content = "Service Error";
    },
  },
};
</script>




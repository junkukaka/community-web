<template>
  <v-card flat class="pa-2">
    <v-data-table
      flat
      :headers="headers"
      :items="members"
      :disable-pagination="disablePagination"
      class="elevation-1 mytable"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Member List</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

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
    page: 1,
    itemsPerPage: 1000,
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
      this.$nextTick(function () {
        this.$http
          .get("/member/members/getAllMemberByAdmin")
          .then((response) => {
            this.members = response.data.data;
          });
      });

      this.$nextTick(function () {
        this.$http
          .get("/member/members/department")
          .then((response) => (this.departments = response.data.data));
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




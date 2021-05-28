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
        <v-btn text color="primary">
          {{ item.memberName }}
        </v-btn>
      </template>
    </v-data-table>
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
  </v-card>
</template>

<script>
export default {
  data: () => ({
    member: {},
    page: 1,
    itemsPerPage: 5,
    pages: 1,
    members: [],
    dialog: false,
    disablePagination: true,
    headers: [
      { text: "Name", align: "start", value: "memberName" },
      { text: "상태", value: "status" },
      { text: "login id", value: "loginId" },
      { text: "가입일자", value: "registerTime" },
      { text: "등록일자", value: "updateTime" },
    ],
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
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
            // this.page = response.data.data.page; //当前页面
            // this.pages = response.data.data.pages; //页数
          });
      });
    },
  },
};
</script>




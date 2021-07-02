<template>
  <v-card flat class="pa-2">
    <v-data-table
      flat
      :headers="headers"
      :items="notifications"
      class="elevation-1 mytable"
      :disable-pagination="disablePagination"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My community comment</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

      <template v-slot:[`item.title`]="{ item }">
        <a class="font-weight-medium" @click="toCommunity(item)">
          {{ item.title }}
        </a>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn text @click="deleteItem(item)">
          <v-icon small>mdi-message-bulleted-off</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: ["parent"],
  data: () => ({
    member: {},
    disablePagination: true,
    notifications: [],
    headers: [
      { text: "Title", align: "start", value: "title" },
      { text: "Count", value: "cnt" },
      { text: "Actions", align: "center", value: "actions", sortable: false },
    ],
  }),

  created() {
    this.member = this.$props.parent;
    this.initialize();
  },

  methods: {
    initialize() {
      this.$nextTick(function () {  
        this.$http
          .get(`/comment/getMyCommunityComment/${this.member.id}`)
          .then((response) => {
            this.notifications = response.data.data;
          });
      });    
    },

    deleteItem(item) {
      this.readComment(item);
      this.getMyCommunityCommentCount();
      this.initialize();
    },

    toCommunity(item) {
      this.readComment(item);
      this.getMyCommunityCommentCount();
      this.$router.push(`/community/communityDetail?id=${item.id}`);
    },

    readComment(item) {
      this.$nextTick(function () {
        this.$http.put(`/comment/readComment/${item.id}`);
      });
    },

    getMyCommunityCommentCount() {
      this.$nextTick(function () {
        this.$http
          .get(`/comment/getMyCommunityCommentCount/${this.member.id}`)
          .then((response) => {
            this.$store.state.memberAlert = response.data.data;
          });
      });
    },
  },
};
</script>




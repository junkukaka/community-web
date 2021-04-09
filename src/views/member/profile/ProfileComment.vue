<template>
  <v-card flat class="pa-2">
    <v-data-table 
      flat
      :headers="headers"
      :items="comments"
      class="elevation-1 mytable"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My Comments</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

 
    <template v-slot:[`item.title`]="{ item }">
      <v-btn text :to="`/community/communityDetail?id=${item.communityId}`" color="primary">
        {{ item.title }}
      </v-btn>
    </template>

    <template v-slot:[`item.date`]="{ item }">
        {{ item.date |date-format('yyyy-mm-dd hh:mi:ss') }}
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-btn text @click="deleteItem(item.id)">
        <v-icon small> mdi-delete </v-icon>
        Delete
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
  props: ["parent"],
  data: () => ({
    member: {},
    page: 1,
    itemsPerPage: 20,
    pages: 1,
    comments: [],
    dialogDelete: false,
    headers: [
      { text: "Title", align: "start", value: "title",},
      { text: "Menu Name", value: "menuName" },
      { text: "Content", value: "content" },
      { text: "Date", value: "date" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    deletedId: -1,
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.member = this.$props.parent;
    this.initialize();
  },

  watch: {
    page: function(){
        this.initialize();
      }
  },

  methods: {
    //
    initialize() {
      let request = {
        params: {
          memberId: this.member.id,
          page: this.page,
          itemsPerPage: this.itemsPerPage
        },
      };
      //select community list by member
      this.$nextTick(function () {
        this.$http
          .get("/comment/comments/pageList", request)
          .then((response) => {
            this.comments = response.data.data.comments;
            this.page = response.data.data.page; //当前页面
            this.pages = response.data.data.pages; //页数
          });
      });
    },

    deleteItem(id) {
      this.deletedId = id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.$http.delete(`/comment/comments/${this.deletedId}`)
      .then((response) => {
        console.log(response);
        if(response.data.code == 200){
          this.closeDelete();
        }
      })
      
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.initialize();
    },
  },
};
</script>

<style scoped>
.v-application .elevation-1 {
    box-shadow:none !important
}
</style>


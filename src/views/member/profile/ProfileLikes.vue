<template>
  <v-card flat class="pa-2">
    <v-data-table 
      flat
      :headers="headers"
      :items="likes"
      class="elevation-1 mytable"
      :disable-pagination="disablePagination"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My Likes</v-toolbar-title>
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
      <div>
        <router-link :to="`/community/communityDetail?id=${item.communityId}`" color="primary" 
          v-text="
            `${
              item.title.length < 35
                ? item.title
                : item.title.substring(0, 35) + '...'
            }`
          "
        />
      </div>
    </template>

    <template v-slot:[`item.date`]="{ item }">
        {{ item.date |date-format('yyyy-mm-dd') }}
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-btn text @click="deleteItem(item)">
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
    itemsPerPage: 30,
    pages: 1,
    likes: [],
    dialogDelete: false,
    disablePagination: true,
    headers: [
      { text: "Title", align: "start", value: "title",},
      { text: "Menu Name", value: "menuName" },
      { text: "Date", value: "date" , align: "center"},
      { text: "Actions", value: "actions", sortable: false , align: "center"},
    ],
    deleted: {},
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
          .get("/comInfo/likes/likesPageList", request)
          .then((response) => {
            this.likes = response.data.data.likes;
            this.page = response.data.data.page; //当前页面
            this.pages = response.data.data.pages; //页数
          });
      });
    },

    deleteItem(item) {
      this.deleted.communityId = item.communityId;
      this.deleted.memberId = item.memberId;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.$http.post('/comInfo/save/likes',this.deleted)
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


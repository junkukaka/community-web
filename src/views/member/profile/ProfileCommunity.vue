<template>
  <v-card flat class="pa-2">
    <v-data-table 
      flat
      :headers="headers"
      :items="communitys"
      class="elevation-1 mytable"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My Communitys</v-toolbar-title>
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
      <v-btn text :to="`/communityDetail?id=${item.id}`">
        {{ item.title }}
      </v-btn>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-btn text :to="`/communityEdit?&menuId=${item.menuId}&id=${item.id}`">
        <v-icon small class="mr-2"  > mdi-pencil </v-icon>
        Edit
      </v-btn>
      <v-btn text>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
    communitys: [],
    dialogDelete: false,
    headers: [
      { text: "Title", align: "start", value: "title",},
      { text: "Likes", value: "likesCount" },
      { text: "Hits", value: "hitsCount" },
      { text: "comment", value: "commentCount" },
      { text: "Date", value: "registerTime" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
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
          itemsPerPage: this.itemsPerPage,
        },
      };
      //select community list by member
      this.$nextTick(function () {
        this.$http
          .get("/community/communitys/getListByMember", request)
          .then((response) => {
            this.communitys = response.data.data.communitys;
            this.page = response.data.data.page; //当前页面
            this.pages = response.data.data.pages; //页数
          });
      });
    },


    editItem(item) {
      console.log(item);

    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
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
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>

<style scoped>
.v-application .elevation-1 {
    box-shadow:none !important
}
</style>


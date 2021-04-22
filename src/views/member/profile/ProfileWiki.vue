<template>
  <v-card flat class="pa-2">
    <v-data-table
      flat
      :headers="headers"
      :items="wikiHis"
      :disable-pagination="disablePagination"
      class="elevation-1 mytable"
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
          {{ item.title }}
      </template>

      <template v-slot:[`item.date`]="{ item }">
        {{ item.date |date-format('yyyy-mm-dd hh:mi:ss') }}
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn text :to="`/wiki/wikiEdit?&menuId=${item.menuId}&id=${item.id}`">
          <v-icon small class="mr-2"> mdi-pencil </v-icon>
          Edit
        </v-btn>
        <v-btn text @click="deleteItem(item)">
          <v-icon small> mdi-delete </v-icon>
          Delete
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
    wikiHis: [],
    dialogDelete: false,
    disablePagination: true,
    headers: [
      { text: "Title", align: "start", value: "title" },
      { text: "Menu Name", value: "menuName" },
      { text: "Date", value: "date" },
      { text: "Actions", value: "actions", sortable: false },
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
    page: function () {
      this.initialize();
    },
  },

  methods: {
    initialize() {
      this.$nextTick(function () {
        this.$http
          .get(`/wiki/wikiProfileList/${this.member.id}`)
          .then((response) => {
            this.wikiHis = response.data.data;
          });
      });
    },

    deleteItem(item) {
      this.deleted.id = item.id;
      this.deleted.memberId = item.memberId;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.$http
        .delete(`/wiki/wikiHis/${this.deleted.id}`)
        .then((response) => {
          console.log(response);
          if (response.data.code == 200) {
            this.closeDelete();
          }
        });
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
  box-shadow: none !important;
}
</style>


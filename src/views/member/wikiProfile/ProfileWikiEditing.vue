<template>
  <v-card flat class="pa-2">
    <v-data-table
      flat
      :headers="headers"
      :items="wikiHis"
      items-per-page="-1"
      class="elevation-1 mytable"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{$t('editingOption',{0:$t('wiki')})}}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >{{$t('msgDeleteConfirm')}}</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                  >{{$t('cancel')}} </v-btn
                >
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm"
                  >{{$t('ok')}}</v-btn
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
        {{ $dateFormat(item.date, 'yyyy-mm-dd hh:mi:ss') }}
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn variant="text" :to="`/wiki/wikiEdit?&menuId=${item.menuId}&id=${item.id}&fromProfile=1`">
          <v-icon size="small" class="mr-2"> mdi-pencil </v-icon>
          {{$t('edit')}}
        </v-btn>
        <v-btn variant="text" @click="deleteItem(item)">
          <v-icon size="small"> mdi-delete </v-icon>
          {{$t('delete')}}
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
    deleted: {},
  }),

   computed: {
    headers(){
      return [
        { title: this.$t('title'), align: "start", key: "title" },
        { title: this.$t('menu'), key: "menuName" },
        { title: this.$t('date'), key: "updateTime",align: "center" },
        { title: this.$t('actions'), key: "actions", sortable: false , align: "center"},
      ]
    }
  },

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


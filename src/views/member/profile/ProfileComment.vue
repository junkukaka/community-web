<template>
  <v-card flat class="pa-2">
    <v-data-table 
      flat
      :headers="headers"
      :items="comments"
      :disable-pagination="disablePagination"
      class="elevation-1 mytable"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{$t('my00',{0:$t('comments')})}}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >{{$t('msgDelteConfirm')}}</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >{{$t('cancle')}}</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >{{$t('ok')}}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

 
    <template v-slot:[`item.title`]="{ item }">
      <div style="width:300px;">
      <router-link :to="`/community/communityDetail?id=${item.communityId}`" color="primary" 
          v-text="
            `${
              item.title.length < 20
                ? item.title
                : item.title.substring(0, 20) + '...'
            }`
          "
        />
      </div>
    </template>

    <template v-slot:[`item.menuName`]="{ item }">
      <div style="width:150px;" v-text="
        `${
              item.menuName.length < 10
                ? item.menuName
                : item.menuName.substring(0, 10) + '...'
            }`
      ">
      </div>  
    </template>

    <template v-slot:[`item.content`]="{ item }">
      <div v-text="
        `${
              item.content.length < 25
                ? item.content
                : item.content.substring(0, 25) + '...'
            }`
      ">
      </div>  
    </template>

    <template v-slot:[`item.date`]="{ item }">
        {{ item.date |date-format('yyyy-mm-dd') }}
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-btn text @click="deleteItem(item.id)">
        <v-icon small> mdi-delete </v-icon>
        {{$t('delete')}} 
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
    comments: [],
    disablePagination: true,
    dialogDelete: false,
    deletedId: -1,
  }),

  computed: {
    headers(){
      return [
        { text: this.$t('title'), align: "start", value: "title" },
        { text: this.$t('menu'),  align: "start",value: "menuName" },
        { text: this.$t('contant'), value: "content" },
        { text: this.$t('date'),value: "date" ,align: "center"},
        { text: this.$t('actions'),value: "actions", sortable: false ,align: "center"},
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


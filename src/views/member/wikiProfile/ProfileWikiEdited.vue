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
          <v-toolbar-title>{{$t('editedOption',{0:$t('wiki')})}}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

      <template v-slot:[`item.title`]="{ item }">
          <router-link :to="`/wiki/wikiDetail?wikiId=${item.id}`" color="indigo"
             v-text="`${
              item.title.length < 50
              ? item.title
              : item.title.substring(0, 50) + '...'
          }`"/>
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
  }),

  computed: {
    headers(){
      return [
        { title: this.$t('title'), align: "start", key: "title" },
        { title: this.$t('menu'), key: "menuName" },
        { title: this.$t('date'), key: "updateTime",align: "center" },
      ]
    }
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
          .get(`/wiki/wikiProfileEditedList/${this.member.id}`)
          .then((response) => {
            this.wikiHis = response.data.data;
          });
      });
    },
  },
};
</script>

<style scoped>
.v-application .elevation-1 {
  box-shadow: none !important;
}
</style>


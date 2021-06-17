<template>
  <v-card flat>
    <v-toolbar flat>
      <template>
        <v-tabs v-model="tabs" class="pl-3">
          <v-tab href="#normalEditor">Normal Editor</v-tab>
          <v-tab href="#makedowmEditor">makedowm Editor</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tabs" class="pa-3 pt-5" >
      <!-- vue2Editor -->
      <v-tab-item value="normalEditor">
        <editor-vue v-bind:parent="community"/>
      </v-tab-item>
      <!-- MdEditor -->
      <v-tab-item value="makedowmEditor">
        <editor-md v-bind:parent="community"/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import EditorMd from "./EditorMd.vue";
import EditorVue from "./EditorVue.vue";

export default {
  components: {
    EditorVue,
    EditorMd,
  },

  data: () => ({
    tabs: "normalEditor",
    community: {
      id: null,
      userId: null,
      menuId: null,
      mdYn: 0,
      useYn: 0,
      title: "",
      content: ""
    }
  }),

  created: function () {
    this.community.menuId = this.$route.query.menuId;
    this.community.memberId = this.$store.state.member.id;
    this.community.id = this.$route.query.id;
    if (this.community.id != null) {
      this.initialize();
    }
  },

  methods: {
    //初始化
    initialize: function () {
      let data = this.$data;
      this.$nextTick(function () {
        this.$http
          .get(`/community/communitys/${data.community.id}`)
          .then(function (response) {
            data.community = response.data.data;
            console.log(data.community.mdYn)
            if(data.community.mdYn == 1){
              data.tabs = "makedowmEditor"
            }else{
              data.tabs = "normalEditor"
            }
          });
      });
    },
  },
};
</script>


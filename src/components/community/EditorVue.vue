<template>
  <v-card flat>
    <v-text-field
      label="title"
      hint="this is community title area"
      persistent-hint
      outlined
      style="border-radius: 0"
      v-model.lazy="community.title"
    ></v-text-field>

    <vue-editor id="Editor" v-model.lazy="community.content"> </vue-editor>

    <v-btn
      large
      depressed
      color="primary"
      block
      class="mt-3 white--text "
      @click="save"
    >
      등록
      <v-icon right dark> mdi-pencil </v-icon>
    </v-btn>
  </v-card>
</template>

<script>
import { VueEditor, Quill } from "vue2-editor";
export default {
  components: { VueEditor, Quill },
  props: ["parent"],
  data: () => ({
    community: {
      id: null,
      userId: null,
      menuId: null,
      mdYn: 0,
      useYn: 0,
      title: "",
      content: "",
    },
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
    initialize: function () {
      let data = this.$data;
      this.$nextTick(function () {
        this.$http
          .get(`/community/communitys/${data.community.id}`)
          .then(function (response) {
            data.community = response.data.data;
          });
      });
    },
    //增加内容
    save: function () {
      let router = this.$router;
      let data = this.community;
      this.$nextTick(function () {
        this.$http
          this.$http.post("/community/communitys", data).then((response) => {
          router.go(-1);
        });
      });
    },
  },
};
</script>


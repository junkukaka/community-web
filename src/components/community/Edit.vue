<template>
    <v-card flat>
        <v-text-field
            label="제목"
            hint="www.example.com/page"
            persistent-hint
            outlined
            style="border-radius:0"
          ></v-text-field>
        <vue-editor v-model="content"/>

         <v-btn
            large
            depressed
            color="primary"
            class="ma-2 white--text float-sm-right"
            @click="show"
            >
            등록
            <v-icon
                right
                dark
            >
                mdi-pencil
            </v-icon>
            </v-btn>

    </v-card>
  
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor },

  data: () => ({
    content: "<h1>내용</h1>"
  }),

  methods: {
      show: function(){
          console.log(this.content)
      }
  }
};
</script>

<style lang="stylus">

</style>
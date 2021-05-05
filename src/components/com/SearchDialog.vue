<template>
  <v-card class="pa-5">
    <v-select
      v-model="select"
      :hint="`${select.state}`"
      :items="items"
      item-text="state"
      item-value="abbr"
      label="Select"
      persistent-hint
      return-object
      single-line
    ></v-select>
    <v-text-field
      v-model="content"
      :error-messages="contentErrors"
      :counter="10"
      label="Content"
      required
     @keyup.native.enter="search"
    ></v-text-field>
    <v-btn
      large
      depressed
      block
      color="success"
      class="mt-3 white--text"
      @click="search"
    >
     SEARCH
      <v-icon right dark>mdi-magnify</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
export default {
  props: ["parent"],
  data() {
    return {
      flag: null,
      select: null,
      items: [
        { state: "WIKI", abbr: "WIKI" },
        { state: "COMMUNITY", abbr: "COMMUNITY"}
      ],
      content:"",
      contentErrors: ""
    };
  },

  created() {
    this.flag = this.$props.parent;
    if(this.flag === "WIKI"){
      this.select = {state: "WIKI",abbr: "WIKI"}
    }else if(this.flag === "WIKI"){
      this.select = {state: "COMMUNITY",abbr: "COMMUNITY"}
    }
  },

  methods: {
      search(){
          if(this.flag === "WIKI"){
            console.log(this.flag)
          }else if(this.flag === "COMMUNITY"){

          }
      },
  },
};
</script>
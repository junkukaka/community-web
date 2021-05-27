<template>
    <v-dialog
      v-model="popMsg.dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          {{popMsg.title}}
        </v-card-title>

        <v-card-text>
          {{popMsg.content}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="popMsg.dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>


<script>
export default {
  props: ["parent"],
  data: () => ({
    popMsg: {
      dialog: false,
      content: null,
      title: null
    },
  }),

  created() {
    this.popMsg = this.$props.parent;

  }
};
</script>
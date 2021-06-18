<template>
  <div class="pt-5" v-if="filesList">
    <h3 class="font-weight-medium pl-3 pb-1">File list</h3>
    <v-divider class=""></v-divider>
    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr v-for="item in filesList" :key="item.name">
            <td width="70%">
              <a :href="item.filePath" target="_blank" :download="item.originalName">
                {{ item.originalName }}
              </a>
            </td>
            <td width="30%" style="text-align:right">
              <v-btn
                class="mx-2"
                dark
                small
                color="primary"
                :href="item.filePath"
                target="_blank"
                depressed
              >
                <v-icon>mdi-cloud-download</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: ["parent"],
  data: () => ({
    filesList: [],
    doc: {
      id: null,
      flag: "C"
    },
  }),

  created() {
    this.doc = this.$props.parent;
    this.initialize();
  },

  methods: {
    initialize() {
      this.$http
        .get(
          `/files/getDetailPageList?id=${this.doc.id}&flag=${this.doc.flag}`
        )
        .then((response) => {
          this.filesList = response.data.data;
        });
    },
  },
};
</script>
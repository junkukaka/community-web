<template>
  <div style="margin:47px 0px 30px">
    <v-card class="mx-lg-auto boxShadow" flat style="max-width:900px">
      <v-card-title class="headline primary lighten-1">
        <span style="color: white"> Search for Public Contens </span>
      </v-card-title>
      <v-card-text>
        Explore hundreds of free API's ready for consumption! For more
        information visit
        <router-link
          class="grey--text text--lighten-3"
          to="/wiki"
          target="_blank"
          >wiki repository</router-link
        >
      </v-card-text>
      <v-card-text>
        <v-select
          :items="selects"
          label="Outlined style"
          item-text="state"
          item-value="abbr"
          v-model="searchObj.ty"
          outlined
          @change="searching"
        ></v-select>

        <v-text-field
          v-model="searchObj.content"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="mr-3 ml-3"
          @keyup.native.enter="searching"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-expand-transition>
        <v-list v-if="results" class="">
          <v-list-item
            v-for="(item, i) in results"
            :key="i"
            :to="`${
              searchObj.ty === 'WIKI'
                ? '/wiki/wikiDetail?wikiId=' + item.id
                : '/community/communityDetail?id=' + item.id
            }`"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
              <v-list-item-subtitle
                v-text="item.menuName"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-expand-transition>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!results" color="primary" @click="results = []">
          Clear
          <v-icon right> mdi-close-circle </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    search: null,
    selects: [
      { state: "WIKI", abbr: "WIKI" },
      { state: "COMMUNITY", abbr: "COMMUNITY" },
    ],
    searchObj: {
      ty: null,
      content: null,
      registerId: null,
    },
    results: [],
  }),

  computed: {
    items() {
      return this.entries.map((entry) => {
        const content =
          entry.content.length > this.descriptionLimit
            ? entry.content.slice(0, this.descriptionLimit) + "..."
            : entry.content;

        return Object.assign({}, entry, { content });
      });
    },
  },

  created: function () {
    this.searchObj.ty = this.$route.query.flag;
    this.searchObj.content = this.$route.query.content;
    this.searchObj.registerId = this.$store.state.member.id;
    this.searching();
  },

  watch: {
    $route() {
      this.searchObj.content = this.$route.query.content;
      this.searching();
    },

    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      this.$http
        .get(`/search/content/${this.search}`)
        .then((res) => {
          this.entries = res.data.data;
          console.log(this.entries);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },

  methods: {
    searching() {
      if (_.trim(this.searchObj.content) === "") {
        return false;
      }
      this.results = [];
      this.searchObj.content = _.trim(this.searchObj.content);
      this.$nextTick(function () {
        this.$http;
        this.$http
          .post("/search/comprehensive", this.searchObj)
          .then((response) => {
            this.results = response.data.data;
          });
      });
    },

    test() {
      console.log(`${this.searchObj.ty}  ${this.search}`);
    },
  },
};
</script>
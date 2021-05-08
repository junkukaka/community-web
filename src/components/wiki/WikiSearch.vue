<template>
  <v-card
    color="">
    <v-card-title class="headline primary lighten-1">
      <span style="color: white">
        Search for Public Contens
      </span>
    </v-card-title>
    <v-card-text>
      Explore hundreds of free API's ready for consumption! For more information visit
     <router-link
        class="grey--text text--lighten-3"
        to="/wiki"
        target="_blank"
      >wiki repository</router-link>
    </v-card-text>
    <v-card-text>
      <v-select
          :items="selects"
          label="Outlined style"
          item-text="state"
          item-value="abbr"
          v-model="searchObj.ty"
          outlined
        ></v-select>
      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        hide-selected
        item-text="content"
        item-value="API"
        label="search content"
        placeholder="Start typing to Search"
        prepend-icon="mdi-database-search"
        return-object
        @keyup.native.enter="searching"
      ></v-autocomplete>
    </v-card-text>
    <v-divider></v-divider>
    <v-expand-transition>
      <v-list
        v-if="results"
        class=""
      >
        <v-list-item
          v-for="(item, i) in results"
          :key="i"
          :to="'/wiki/wikiDetail?wikiId=' + item.id"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expand-transition>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!model"
        color="grey darken-3"
        @click="model = null"
      >
        Clear
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
      selects:  [
        { state: "WIKI", abbr: "WIKI" },
        { state: "COMMUNITY", abbr: "COMMUNITY"}
      ],
      searchObj: {
        ty: null,
        content: null
      },
      results: [],
    }),

    computed: {
      items () {
        return this.entries.map(entry => {
          const content = entry.content.length > this.descriptionLimit
            ? entry.content.slice(0, this.descriptionLimit) + '...'
            : entry.content

          return Object.assign({}, entry, { content })
        })
      },
    },

    created: function(){
       this.search = this.$route.query.content;
    },

    watch: {
      search (val) {
        // Items have already been loaded
        if (this.items.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        // Lazily load input items
        this.$http.get(`/search/content/${this.search}`)
          .then((res) => {
              this.entries = res.data.data
              console.log(this.entries)
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      },
    },

    methods:{
      searching(){
        // if(!this.model){
        //   console.log(this.search);
        // }else{
        //   console.log(this.model);
        // }
        this.searchObj.content= this.search;

        this.$nextTick(function () {
          this.$http
            this.$http.post("/search/comprehensive", this.searchObj).then((response) => {
              this.results = response.data.data;
              console.log(this.results);
          });
        });

      },

      test(){
        console.log(`${this.searchObj.ty}  ${this.search}`)
      }
    }
  }
</script>
<template>
  <v-card flat class="mx-auto">
    <v-container>
      <v-row dense>
        <v-col
          v-for="(item, i) in items"
          :key="i"
          cols="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
        >
          <v-card :color="item.color" flat>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="text-h6"
                  v-text="`${item.title.length < 47 ? item.title : (item.title.substring(0,47) + '...') }`"
                ></v-card-title>
                <v-card-subtitle v-text="item.artist"></v-card-subtitle>
                <v-card-actions style="margin-top:-16px !important">
                  <v-btn class="ml-1" outlined rounded small>
                    Wiki Edit
                  </v-btn>
                </v-card-actions>
              </div>
              <v-avatar class="ma-4" size="80" tile>
                <v-img :src="item.src"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>


<script>
export default {
  data: () => ({
    items: [
      {
        color: "#FAFAFA",
        src: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
        title: "Supermodel",
        artist: "Foster the People",
      },
      {
        color: "#FAFAFA",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding",
      },
      {
        color: "#FAFAFA",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days Halcyon DaysHalcyon DaysHalcyon DaysHalcyon DaysHalcyon Days",
        artist: "Ellie Goulding",
      },
      {
        color: "#FAFAFA",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding",
      },
    ],
  }),
};
</script>


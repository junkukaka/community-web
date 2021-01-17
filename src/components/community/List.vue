<template>
  <v-card
    class="mx-auto"
    max-width="500"
  >
    <v-toolbar
      color="teal"
      dark
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Topics</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list>
      <v-list-group
        v-for="item in menu"
        :key="item.id"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="c in item.child"
          :key="c.name"
        >
          <v-list-item-content>
            <v-list-item-title v-text="c.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
</template>


<script>
  export default {
    data: () => ({
      selectedItem: 1,
      menu: [
          {
              "tier": 1,
              "name": "3",
              "id": 148,
              "child": [
                  {
                      "id": 153,
                      "name": "bb",
                      "tier": 2,
                      "father": 148,
                      "useYn": "Y",
                      "registerId": null,
                      "registerTime": "2021-01-14T06:52:00.000+00:00",
                      "updateId": null,
                      "updateTime": "2021-01-17T13:07:26.000+00:00"
                  },
                  {
                      "id": 154,
                      "name": "ab",
                      "tier": 2,
                      "father": 148,
                      "useYn": "Y",
                      "registerId": null,
                      "registerTime": "2021-01-14T06:52:06.000+00:00",
                      "updateId": null,
                      "updateTime": null
                  }
              ]
          },
          {
              "tier": 1,
              "name": "2",
              "id": 150,
              "child": [
                  {
                      "id": 161,
                      "name": "sd",
                      "tier": 2,
                      "father": 150,
                      "useYn": "Y",
                      "registerId": null,
                      "registerTime": "2021-01-14T06:57:35.000+00:00",
                      "updateId": null,
                      "updateTime": null
                  },
                  {
                      "id": 164,
                      "name": "bb2",
                      "tier": 2,
                      "father": 150,
                      "useYn": "Y",
                      "registerId": null,
                      "registerTime": "2021-01-14T06:58:16.000+00:00",
                      "updateId": null,
                      "updateTime": "2021-01-14T06:58:38.000+00:00"
                  }
              ]
          },
          {
              "tier": 1,
              "name": "6",
              "id": 167
          }
      ],
    }),

    created: function(){
      this.initialize();
    },

    methods: {
      //初始化方法
      initialize: function(){
        let data = this.$data;
        let request = {
            tier : 1
        }
        this.$nextTick(function(){
          this.$http.post("/menu/menus/condition",request).then(function(response){
            data.menu = response.data.data
            console.log(response.data.data);
          })
        })
      },

    }


  }
</script>
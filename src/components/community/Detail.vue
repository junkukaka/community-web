<template>
    <v-card flat>
        <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-2" style="color: rgba(0,0,0,.6)">
                    {{community.registerTime|date-format('yyyy-mm-dd hh:mi:ss')}}
                </div>
                <v-list-item-title class="headline mb-3 text-h4">
                    {{community.title}}
                </v-list-item-title>
                <v-list-item-subtitle>
                    <span class="mr-3"> 100 liks</span> 
                    <span class="mr-3"> 648 Views</span> 
                    <span class="mr-3"> 28 Comments</span> 
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-card-actions style="padding: 0px">
            <v-list-item class="grow">
                <v-list-item-avatar color="grey darken-3">
                <v-img
                    class="elevation-6"
                    alt=""
                    src="https://cdn.vuetifyjs.com/images/lists/1.jpg"
                ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                <v-list-item-title>
                    남광준
                </v-list-item-title>
                </v-list-item-content>

                <v-row align="center" justify="end">
                    <v-icon class="mr-2">
                        mdi-domain
                    </v-icon>
                    <span class="subheading mr-2">: 운영팀</span>
                </v-row>
            </v-list-item>
        </v-card-actions>

        <v-fab-transition>
          <router-link :to="`/communityEdit?id=${community.id}`">
            <v-btn
              color="indigo"
              dark
              fixed
              bottom
              right
              fab
              style="right:50px;bottom:50px"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </router-link>
        </v-fab-transition>

        <v-divider class="mb-7 ml-3 "></v-divider>
        <div id="read" 
            class="text-justify  mb-3 ml-3" 
            v-html="community.content">
        </div>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        community: {
            id: '',
            title:'',
            content: '',
            registerTime: '',
            menuId:''
        },
    }),

    created(){
        this.community.id = this.$route.query.id;
        this.initialize();
    },

    methods: {
        initialize () {
            let data = this.$data
            this.$nextTick(function(){
                this.$http.get(`/community/communitys/${data.community.id}`) 
                .then(function(response){
                    data.community = response.data.data
                });
            })
        }
    }

}
</script>

<style>
    #read .ql-syntax{
            background-color:rgb(236, 236, 236);
            padding: 10px;
        }
</style>
<template>
  <div class="pl-3 pt-5" style="position:relative">
    <v-icon small color="black" style="position:absolute; left: 12px; top: 22px">
        mdi-chevron-double-right
    </v-icon>
    <v-breadcrumbs :items="items" style="padding: 0px 0 0 29px">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
  export default {
    data: () => ({
      dashboard: {
        flag: null,
        menuId: null,
        detail: null 
      },  
      routeObj:{},
      menus: [],
      items: [],
    }),

    watch: {
      $route : function(){
        this.reset();
        this.routeObj = this.$route;
        this.initialize();
      }
    },
    
    created(){
      this.reset();
      this.routeObj = this.$route;
      this.initialize();
    },

    methods: {
      initialize(){
        if(this.routeObj.name === "WikiDetail"){
          this.getWikiDetailDashboard();
        }else if(this.routeObj.name === "CommunityDetail"){
          this.getCommunityDetailDashboard();
        }else if(this.routeObj.name === "CommunityList"){
          this.dashboard.menuId = this.$route.query.menuId;
          this.dashboard.flag = "CommunityList";
          this.dashboard.detail = false;
          this.communityDashboard();
        }else if(this.routeObj.name === "WikiList"){
          this.dashboard.menuId = this.$route.query.menuId;
          this.dashboard.flag = "WikiList";
          this.dashboard.detail = false;
          this.wikiDashboard();
        }

      },

      toDashboard(){
        let m = {}
        for(let menu of this.menus){
          m.text = menu.text;
          if(this.dashboard.flag === "WikiDetail" || this.dashboard.flag === "WikiList"){
            m.href = `/wiki/wikiList?menuId=${menu.menuId}`;
          }else if(this.dashboard.flag === "CommunityDetail" || this.dashboard.flag === "CommunityList"){
            m.href = `/community/communityList?menuId=${menu.menuId}`;
          }
          
          if(this.dashboard.menuId == menu.menuId && !this.dashboard.detail){
            m.disabled = true;
          }else{
            m.disabled = false;
          }
          this.items.push(m);
          m = {};
        }
      },

      getDashboard(){
         //if WikiDetial 
        if(this.dashboard.flag === "WikiDetail"){
          this.wikiDashboard();
        }
        //if CommunityDetial
        else if(this.dashboard.flag === "CommunityDetail"){
          this.communityDashboard();
        }
      },

      //wikiDetail start  --------------------------------------------
      getWikiDetailDashboard(){
        this.dashboard.detail = true;
        this.dashboard.flag = "WikiDetail";
        this.getWikiDetailMenuId();
      },

      getWikiDetailMenuId(){
        if(this.routeObj.name === "WikiDetail"){
          this.$http(`/wiki/getWikiMenuId/${this.routeObj.query.wikiId}`)
            .then((response) => {
              this.dashboard.menuId = response.data.data;
              this.getDashboard();
            })
        }
      },

      wikiDashboard(){
        this.$nextTick(function () {
          this.$http.get(`/wikiMenu/dashboard/${this.dashboard.menuId}`).then((response) => {
            this.menus = response.data.data;
            this.toDashboard();
          });
        });
      },
      //wikiDetail end --------------------------------------------

      //CommunityDetail start  --------------------------------------------
      getCommunityDetailDashboard(){
        this.dashboard.detail = true;
        this.dashboard.flag = "CommunityDetail";
        this.getCommunityDetailMenuId();
      },

      getCommunityDetailMenuId(){
        if(this.routeObj.name === "CommunityDetail"){
          this.$http(`/community/getCommunityMenuId/${this.routeObj.query.id}`)
            .then((response) => {
              this.dashboard.menuId = response.data.data;
              this.getDashboard();
            })
        }
      },

      communityDashboard(){
        this.$nextTick(function () {
          this.$http.get(`/communityMenu/dashboard/${this.dashboard.menuId}`).then((response) => {
            this.menus = response.data.data;
            this.toDashboard();
          });
        });
      },
      //CommunityDetail end --------------------------------------------

      reset(){
        this.menus = [];
        this.items = [];
      }

    }


  }
</script>


<template>
    <v-app>
        
        <Drawer/>
        <AppBar/>
        <!-- Sizes your content based upon application components -->
        <v-main :style="{padding: `64px ${this.$store.state.window.mainPaddingLeft}px 0px ${this.$store.state.window.mainPaddingRight}px !important`}">
            <!-- Provides the application the proper gutter -->
            <v-container fluid class="pa-4 pa-sm-6 pa-md-8"  color="grey lighten-4">
                <!-- If using vue-router -->
                <router-view></router-view>
            </v-container>
        </v-main>
        <RightDrawer/>
    </v-app>
</template>

<script>
export default {
    name: "Index",
    components: {
        AppBar: () => import('@/components/core/AppBar'),
        Drawer: () => import('@/components/core/Drawer'),
        RightDrawer: () => import('@/components/core/RightDrawer')
    },

     data () {
        return {
            paddingLeft : 256,
            paddingRight: 300
        }
    },

    methods: {
        pageResize(){
            let screenWidth = document.body.clientWidth
            if(screenWidth < 1264){
                this.$store.state.window.rightDrawerTop = -1000
                this.$store.state.window.mainPaddingLeft = 0
                this.$store.state.window.mainPaddingRight = 0
            }else{
                this.$store.state.window.rightDrawerTop = 64
                this.$store.state.window.mainPaddingLeft = 256
                this.$store.state.window.mainPaddingRight = 300
            }
        }
    },

    mounted () {
      let that = this;//赋值vue的this
      window.onresize = ()=>{
　　　　//调用methods中的事件
        that.pageResize();
      }
    },

    created(){
        this.pageResize()
    },
    
}
</script>

<template>
    <v-app>
        <AppBar/>
        <Drawer/>
        <!-- Sizes your content based upon application components -->
        <v-main>
            <!-- Provides the application the proper gutter -->
            <v-container fluid>
            <!-- If using vue-router -->
            <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "Index",
    components: {
        AppBar: () => import('@/components/core/AppBar'),
        Drawer: () => import('@/components/core/Drawer')
    }
    
}
</script>
import Vue from 'vue'
import VueRouter from 'vue-router'

//1.引入router 插件
Vue.use(VueRouter)
//2.路由的规则定义数组
const routes = [
    {
        path: '/',
        component: () => import('@/views/Index'),
        redirect : "/home",
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('@/views/Home')
            },
            {
                path: '/menu',
                name: 'Menu',
                component: () => import('@/views/admin/Menu')
            },
            {
                path: '/tree',
                component: () => import('@/views/admin/Tree')
            },
            {
                path: '/communityList/:id',
                component: () => import('@/components/community/List')
            },
            {
                path: '/communityEdit',
                component: () => import('@/components/community/Edit')
            },

        ],
    }
]

//3.vuerouter 对象
const router = new VueRouter({
    routes,
    mode: "history"
})

//4.导出vuerouter 对象
export default router;

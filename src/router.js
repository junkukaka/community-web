import Vue from 'vue'
import VueRouter from 'vue-router'

//1.引入router 插件
Vue.use(VueRouter)
//2.路由的规则定义数组
const routes = [
    {
        path: '/',
        component: () => import('@/views/Index'),
        redirect: "/home",
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
                path: '/communityList',
                component: () => import('@/components/community/List')
            },
            {
                path: '/communityEdit',
                component: () => import('@/components/community/Edit')
            },
            {
                path: '/communityDetail',
                component: () => import('@/components/community/Detail')
            },
            {
                path: '/signUp',
                name: 'SignUp',
                component: () => import('@/views/member/SignUp')
            },
            {
                path: '/signIn',
                name: 'SignIn',
                component: () => import('@/views/member/SignIn')
            },
            {
                path: '/memberInfo',
                name: 'memberInfo',
                component: () => import('@/views/member/MemberInfo')
            },
            {
                path: '/memberList',
                name: 'MemberList',
                component: () => import('@/views/member/MemberList')
            },
            {
                path: '/profile',
                name: 'Profile',
                component: () => import('@/views/member/profile/Profile')
            }
        ],
    },

]


//3.vuerouter 对象
const router = new VueRouter({
    routes,
    mode: "history"
});

router.beforeEach((to, from, next) => {
    //允许访问的路径
    const arrJPath = ['/signIn','/communityList','/signUp']
    if (arrJPath.find(element => element == to.path)) {
        next();
    } else {
        let token = localStorage.getItem('Authorization');
        if (token === null || token === '') {
            //console.log(`token is ${token}`);
            next('/signIn');
        } else {
            next();
        }
    }
});




//4.导出vuerouter 对象
export default router;

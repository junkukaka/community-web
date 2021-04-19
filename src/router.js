import Vue from 'vue'
import VueRouter from 'vue-router'

//1.引入router 插件
Vue.use(VueRouter)
//2.路由的规则定义数组
const routes = [
    {
        path: '/',
        component: () => import('@/views/Index'),
        redirect: "/main",
        children: [
            {
                path: 'main',
                name: 'Main',
                component: () => import('@/views/main/community/Main')
            },
            {
                path: 'tree',
                component: () => import('@/views/admin/Tree')
            },
            {
                path: 'signUp',
                name: 'SignUp',
                component: () => import('@/views/member/user/SignUp')
            },
            {
                path: 'signIn',
                name: 'SignIn',
                component: () => import('@/views/member/user/SignIn')
            },
            {
                path: 'memberInfo',
                name: 'memberInfo',
                component: () => import('@/views/member/user/MemberInfo')
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/member/profile/Profile')
            },
            {
                path: 'memberList',
                name: 'MemberList',
                component: () => import('@/views/admin/MemberList')
            }
        ],
    },
    {
        path: '/community',
        component: () => import('@/views/IndexCommunity'),
        redirect: "/community/communityMain",  
        children: [
            {
                path: 'communityMain',
                name: 'CommunityMain',
                component: () => import('@/views/main/community/Main')
            },
            {
                path: 'communityMenu',
                name: 'CommunityMenu',
                component: () => import('@/views/admin/CommunityMenu')
            },
            {
                path: 'communityList',
                component: () => import('@/components/community/List')
            },
            {
                path: 'communityEdit',
                component: () => import('@/components/community/Edit')
            },
            {
                path: 'communityDetail',
                component: () => import('@/components/community/Detail')
            }
        ]
    },
    {
        path: '/wiki',
        component: () => import('@/views/IndexWiki'),
        redirect: "/wiki/wikiMain",  
        children: [
            {
                path: 'wikiMain',
                name: 'wikiMain',
                component: () => import('@/views/main/wiki/Main')
            },
            {
                path: 'wikiMenu',
                name: 'WikiMenu',
                component: () => import('@/views/admin/WikiMenu')
            },
            {
                path: 'wikiList',
                name: 'wikiList',
                component: () => import('@/components/wiki/List')
            },
            {
                path: 'wikiDetail',
                name: 'WikiDetail',
                component: () => import('@/components/wiki/Detail')
            },
            {
                path: 'wikiEdit',
                name: 'WikiEdit',
                component: () => import('@/components/wiki/Edit')
            }
        ]
    }

]


//3.vuerouter 对象
const router = new VueRouter({
    routes,
    mode: "history"
});

router.beforeEach((to, from, next) => {
    //允许访问的路径
    const arrJPath = ['/signIn','/community/communityList','/signUp']
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

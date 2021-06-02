import Vue from 'vue'
import VueRouter from 'vue-router'

//1.引入router 插件
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
                path: 'updatePassword',
                name: 'UpdatePassword',
                component: () => import('@/views/member/user/UpdatePassword')
            }
        ],
    },
    {
        path: '/aspnAdmin',
        component: () => import('@/views/IndexAdmin'),
        redirect: "/aspnAdmin/memberComprehensive",  
        children: [
            {
                path: 'memberComprehensive',
                name: 'Comprehensive',
                component: () => import('@/views/admin/member/Comprehensive')
            },
            {
                path: 'communityMenu',
                name: 'CommunityMenu',
                component: () => import('@/views/admin/menu/CommunityMenu')
            },
            {
                path: 'wikiMenu',
                name: 'WikiMenu',
                component: () => import('@/views/admin/menu/WikiMenu')
            },
        ]
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
                path: 'communityList',
                name: 'CommunityList',
                component: () => import('@/components/community/List')
            },
            {
                path: 'communityEdit',
                name: 'CommunityEdit',
                component: () => import('@/components/community/Edit')
            },
            {
                path: 'communityDetail',
                name: 'CommunityDetail',
                component: () => import('@/components/community/Detail')
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/member/profile/Profile')
            },
            {
                path: 'communitySearch',
                name: 'CommunitySearch',
                component: () => import('@/components/com/Search')
            },
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
                path: 'wikiList',
                name: 'WikiList',
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
            },
            {
                path: 'hisReview',
                name: 'HisReview',
                component: () => import('@/components/wiki/HisReview')
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/member/wikiProfile/Profile')
            },
            {
                path: 'wikiSearch',
                name: 'WikiSearch',
                component: () => import('@/components/com/Search')
            },
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
            // console.log(`token is ${token}`);
            next('/signIn');
        } else {
            next();
        }
    }
});




//4.导出vuerouter 对象
export default router;

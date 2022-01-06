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
                component: () => import('@/views/main/index/Main'),
                meta:{
                    title: "ASPN-wiki&community"
                },
            },
            {
                path: 'signUp',
                name: 'SignUp',
                component: () => import('@/views/member/user/SignUp'),
                meta:{
                    title: "ASPN-signUp"
                },
            },
            {
                path: 'signIn',
                name: 'SignIn',
                component: () => import('@/views/member/user/SignIn'),
                meta:{
                    title: "ASPN-signIn"
                },
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/member/profile/Profile'),
                meta:{
                    title: "ASPN-profile"
                },
            },
            {
                path: 'search',
                name: 'Search',
                component: () => import('@/components/com/Search'),
                meta:{
                    title: "ASPN-search"
                },
            },
            {
                path: 'reportMain',
                name: 'ReportMain',
                component: () => import('@/views/report/ReportMain'),
                meta:{
                    title: "ASPN-reportMain"
                },
            },
        ],
    },
    {
        path: '/member',
        component: () => import('@/views/IndexMember'),
        redirect: "/member/wikiCollect",  
        children: [
            {
                path: 'memberInfo',
                name: 'memberInfo',
                component: () => import('@/views/member/user/MemberInfo'),
                meta:{
                    title: "ASPN-memberInfo"
                },
            },
            {
                path: 'updatePassword',
                name: 'UpdatePassword',
                component: () => import('@/views/member/user/UpdatePassword'),
                meta:{
                    title: "ASPN-updatePassword"
                },
            },
            {
                path: 'communityProfile',
                name: 'CommunityProfile',
                component: () => import('@/views/member/profile/Profile'),
                meta:{
                    title: "ASPN-communityProfile"
                },
            },
            {
                path: 'wikiProfile',
                name: 'WikiProfile',
                component: () => import('@/views/member/wikiProfile/Profile'),
                meta:{
                    title: "ASPN-wikiProfile"
                },
            },
            {
                path: 'notifications',
                name: 'Notifications',
                component: () => import('@/views/member/notification/Notifications'),
                meta:{
                    title: "ASPN-Notifications"
                },
            },
            {
                path: 'wikiCollect',
                name: 'WikiCollect',
                component: () => import('@/views/member/wikiProfile/ProfileWikiCollect'),
                meta:{
                    title: "ASPN-wikiProfile"
                },
            },
        ]
    },
    {
        path: '/aspnAdmin',
        component: () => import('@/views/IndexAdmin'),
        redirect: "/aspnAdmin/memberComprehensive",  
        children: [
            {
                path: 'memberComprehensive',
                name: 'MemberComprehensive',
                component: () => import('@/views/admin/member/Comprehensive'),
                meta:{
                    title: "ASPN-admin"
                },
            },
            {
                path: 'communityMenu',
                name: 'CommunityMenu',
                component: () => import('@/views/admin/menu/CommunityMenu'),
                meta:{
                    title: "ASPN-admin"
                },
            },
            {
                path: 'wikiMenu',
                name: 'WikiMenu',
                component: () => import('@/views/admin/menu/WikiMenu'),
                meta:{
                    title: "ASPN-admin"
                },
            },
            {
                path: 'authorityComprehensive',
                name: 'AuthorityComprehensive',
                component: () => import('@/views/admin/authority/Comprehensive'),
                meta:{
                    title: "ASPN-admin"
                },
            },
            {
                path: 'communityManage',
                name: 'CommunityManage',
                component: () => import('@/views/admin/article/CommunityManage'),
                meta:{
                    title: "ASPN-CommunityManage"
                },
            },
            {
                path: 'wikiManage',
                name: 'WikiManage',
                component: () => import('@/views/admin/article/WikiManage'),
                meta:{
                    title: "ASPN-WikiManage"
                },
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
                component: () => import('@/views/main/community/Main'),
                meta:{
                    title: "ASPN-community-main"
                },
            },
            {
                path: 'communityList',
                name: 'CommunityList',
                component: () => import('@/components/community/List'),
                meta:{
                    title: "ASPN-community-list"
                },
            },
            {
                path: 'communityEdit',
                name: 'CommunityEdit',
                component: () => import('@/components/community/Edit'),
                meta:{
                    title: "ASPN-community-edit"
                },
            },
            {
                path: 'communityDetail',
                name: 'CommunityDetail',
                component: () => import('@/components/community/Detail'),
                meta:{
                    title: "ASPN-community-detail"
                },
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
                component: () => import('@/views/main/wiki/WikiTemplate'),
                meta:{
                    title: "ASPN-wiki-main"
                },
            },
            {
                path: 'wikiList',
                name: 'WikiList',
                component: () => import('@/components/wiki/List'),
                meta:{
                    title: "ASPN-wiki-list"
                },
            },
            {
                path: 'wikiDetail',
                name: 'WikiDetail',
                component: () => import('@/components/wiki/Detail'),
                meta:{
                    title: "ASPN-wiki-detail"
                },
            },
            {
                path: 'wikiEdit',
                name: 'WikiEdit',
                component: () => import('@/components/wiki/Edit'),
                meta:{
                    title: "ASPN-wiki-edit"
                },
            },
            {
                path: 'hisReview',
                name: 'HisReview',
                component: () => import('@/components/wiki/HisReview'),
                meta:{
                    title: "ASPN-wiki-hisReview"
                },
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
    const arrJPath = ['/main','/signIn','/signUp']
    if (arrJPath.find(element => element == to.path)) {
        next();
    } else {
        let token = localStorage.getItem('Authorization');
        if (token === null || token === '') {
            // console.log(`token is ${token}`);
            next('/signIn');
        } else {
            //community & wiki Edite 저장 확인
            if(from.path == '/community/communityEdit' || from.path =='/wiki/wikiEdit'){
                window.onbeforeunload = null;
                next();
            }else{
                next();
            }
        }
    }
  });




//4.导出vuerouter 对象
export default router;

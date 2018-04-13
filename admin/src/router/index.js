import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from '@/views/Login.vue'
import NotFound from '@/views/404.vue'
import Home from '@/views/Home.vue'
import Main from '@/views/Main.vue'

import UserList from '@/views/user/list.vue'

import PrizeList from '@/views/prize/list.vue'

import PrizeLogList from '@/views/prize-log/list.vue'

import RedBagLogList from '@/views/red-bag-log/list.vue'

import PlayLogList from '@/views/play-log/list.vue'

Vue.use(VueRouter);

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '首页',
        iconCls: 'fa fa-home',//图标样式class
        leaf: true,
        children: [
            { path: '/', component: Main, name: '主页' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-users',//图标样式class
        children: [
            { path: '/user/list', component: UserList, name: '用户列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '奖品管理',
        iconCls: 'fa fa-gift',
        children: [
            { path: '/prize/list', component: PrizeList, name: '奖品列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '获奖记录管理',
        iconCls: 'fa fa-th-list',
        children: [
            { path: '/prize-log/list', component: PrizeLogList, name: '获奖记录列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '提现管理',
        iconCls: 'fa fa-credit-card',
        children: [
            { path: '/red-bag-log/list', component: RedBagLogList, name: '提现列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '游戏记录管理',
        iconCls: 'fa fa-gamepad',
        children: [
            { path: '/play-log/list', component: PlayLogList, name: '记录列表' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

const router = new VueRouter({
    routes
})

export default router;

import { createRouter, _RouteRecordBase, Router, createWebHashHistory, } from 'vue-router';
import Layout from '@/layout/index.vue'

const routers = [

    {
        path: "/login",
        name: "登录",
        component: () => import('@pages/login/index.vue'),
        hidden: true,
    },
    {
        path: '/404',
        component: () => import('@pages/404/index.vue'),
        hidden: true,
    },

    {
        path: '/',
        name: '首页',
        hidden: false,
        icon: 'HomeFilled',
        redirect: 'default',
    },
    {
        path: '/home',
        name: 'Default',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/default',
                name: 'Home',
                component: () => import('@pages/default/index.vue')
            },
        ]
    },

    {
        path: "/order",
        component: Layout,
        name: '订单管理',
        icon: 'DocumentCopy',
        children: [
            {
                path: '/order',
                name: '订单',
                icon: 'Tickets',
                component: () => import('@pages/order/index.vue')
            },
            {
                path: '/purchase',
                name: '采购单',
                icon: 'Document',
                component: () => import('@pages/purchase/index.vue')
            },

            {
                path: '/orderDetail',
                name: '订单详情',
                icon: 'Tickets',
                hidden: true,
                component: () => import('@pages/order/orderDetail.vue')
            },
            {
                path: '/delivery',
                name: '送货单详情',
                icon: 'Tickets',
                hidden: true,
                component: () => import('@pages/order/delivery.vue')
            }
        ]
    },
    {
        path: '/sys',
        component: Layout,
        name: '系统管理',
        icon: 'Setting',
        children: [
            {
                path: '/changePassword',
                name: '修改密码',
                icon: 'Key',
                component: () => import('@pages/changePassword/index.vue')
            }
        ]
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
        hidden: true,
    }


]

const router: Router = createRouter({
    // history:createMemoryHistory(),
    history: createWebHashHistory(),
    routes: routers

})

export default router;
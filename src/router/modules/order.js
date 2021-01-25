/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/order',
  component: Layout,
  redirect: '/order/business',
  name: 'order',
  alwaysShow: true,
  meta: {
    title: '订单',
    icon: 'sidebar-order',
    roles: ['DRUG_STORE_ORDER', 'ORG_WEB_ORDER'],
  },
  children: [
    {
      path: 'allorder',
      component: RouterView,
      meta: { title: '药房订单', roles: ['DRUG_STORE_ORDER_ALL_ORDERS'] },
      redirect: '/order/allorder/orderList',
      children: [
        {
          path: 'orderList',
          component: () => import('@/views/pharmacy-order/AllOrder.vue'),
          meta: { activeMenu: '/order/allorder', keepAlive: true },
          hidden: true,
        },
        {
          path: 'orderdetail',
          component: () => import('@/views/pharmacy-order/OrderDetail.vue'),
          meta: { activeMenu: '/order/allorder' },
          props: true,
          hidden: true,
        },
        {
          path: '/prescriptionDetails/:id',
          component: () => import('@/views/prescription/detail'),
          meta: {
            title: '已通过处方详情',
          },
          hidden: true,
          props: true,
        },
      ],
    },
    {
      path: 'tocarryorder',
      component: RouterView,
      meta: {
        title: '药房待自提',
        roles: ['DRUG_STORE_ORDER_ORDER_TO_BE_PICKED_UP'],
      },
      redirect: '/order/tocarryorder/orderList',
      children: [
        {
          path: 'orderList',
          component: () => import('@/views/pharmacy-order/ToCarryOrder.vue'),
          meta: { activeMenu: '/order/tocarryorder', keepAlive: true },
          hidden: true,
        },
        {
          path: 'orderdetail',
          component: () => import('@/views/pharmacy-order/OrderDetail.vue'),
          meta: { activeMenu: '/order/tocarryorder' },
          props: true,
          hidden: true,
        },
      ],
    },
    {
      path: 'tosendorder',
      component: RouterView,
      meta: {
        title: '药房待发货',
        roles: ['DRUG_STORE_ORDER_ORDER_TO_BE_PICKED_UP'],
      },
      redirect: '/order/tosendorder/orderList',
      children: [
        {
          path: 'orderList',
          component: () => import('@/views/pharmacy-order/ToSendOrder.vue'),
          meta: { activeMenu: '/order/tosendorder', keepAlive: true },
          hidden: true,
        },
        {
          path: 'orderdetail',
          component: () => import('@/views/pharmacy-order/OrderDetail.vue'),
          meta: { activeMenu: '/order/tosendorder' },
          props: true,
          hidden: true,
        },
      ],
    },
    {
      path: 'business',
      component: RouterView,
      redirect: '/order/business/list',
      name: 'business',
      meta: {
        title: '机构业务订单',
        roles: ['ORG_WEB_ORDER_BUSINESS_ORDER'],
        // keepAlive: true,
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/order/business/List'),
          meta: {
            title: '列表',
            activeMenu: '/order/business',
            keepAlive: true,
          },
          hidden: true,
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/order/business/Detail'),
          meta: { title: '业务订单详情', activeMenu: '/order/business' },
          hidden: true,
          props: true,
        },
      ],
    },
    {
      path: 'prescription',
      component: RouterView,
      redirect: '/order/prescription/list',
      name: 'prescription',
      meta: {
        title: '机构处方单',
        roles: ['ORG_WEB_ORDER_PRESCRIPTION_MANAGEMENT'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/order/prescription/List'),
          meta: {
            title: '列表',
            activeMenu: '/order/prescription',
            keepAlive: true,
          },
          hidden: true,
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/order/prescription/Detail'),
          meta: { title: '处方详情', activeMenu: '/order/prescription' },
          hidden: true,
          props: true,
        },
      ],
    },
    {
      path: 'prescription-order',
      component: RouterView,
      redirect: '/order/prescription-order/list',
      name: 'prescriptionOrder',
      meta: {
        title: '机构处方订单',
        roles: ['ORG_WEB_ORDER_PRESCRIPTION_ORDER'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/order/prescription-order/List'),
          meta: {
            title: '列表',
            activeMenu: '/order/prescription-order',
            keepAlive: true,
          },
          hidden: true,
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/order/prescription-order/Detail'),
          meta: {
            title: '处方订单详情',
            activeMenu: '/order/prescription-order',
          },
          hidden: true,
          props: true,
        },
        {
          path: '/prescriptionDetails/:id',
          component: () => import('@/views/prescription/detail'),
          meta: {
            title: '已通过处方详情',
          },
          hidden: true,
          props: true,
        },
      ],
    },

    // {
    //   path: 'tocarryorder',
    //   component: () => import('@/views/pharmacy-order/ToCarryOrder.vue'),
    //   meta: {
    //     title: '待自提订单',
    //     roles: ['DRUG_STORE_ORDER_ORDER_TO_BE_PICKED_UP'],
    //   },
    // },
    // {
    //   path: 'tosendorder',
    //   component: () => import('@/views/pharmacy-order/ToSendOrder.vue'),
    //   meta: {
    //     title: '待发货订单',
    //     roles: ['DRUG_STORE_ORDER_ORDER_TO_BE_SHIPPED'],
    //   },
    // },
  ],
}

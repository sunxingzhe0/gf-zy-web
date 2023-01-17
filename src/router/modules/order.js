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
    roles: ['DRUG_STORE_ORDER', 'ORG_WEB_ORDER', 'XZ_ORG_XZ_ORDER'],
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
          meta: {
            activeMenu: '/order/allorder',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
          name: 'order_allorder',
        },
        {
          path: 'orderdetail',
          component: () => import('@/views/pharmacy-order/OrderDetail.vue'),
          meta: { activeMenu: '/order/allorder' },
          name: 'order_allorder_orderdetail',
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
          name: 'order_allorder_prescriptionDetails',
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
          meta: {
            activeMenu: '/order/tocarryorder',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
          name: 'order_tocarryorder',
        },
        {
          path: 'orderdetail',
          component: () => import('@/views/pharmacy-order/OrderDetail.vue'),
          meta: { activeMenu: '/order/tocarryorder' },
          props: true,
          hidden: true,
          name: 'order_tocarryorder_orderdetail',
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
          meta: {
            activeMenu: '/order/tosendorder',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
          name: 'order_tosendorder',
        },
        {
          path: 'orderdetail',
          component: () => import('@/views/pharmacy-order/OrderDetail.vue'),
          meta: { activeMenu: '/order/tosendorder' },
          props: true,
          hidden: true,
          name: 'order_tosendorder_orderdetail',
        },
      ],
    },
    {
      path: 'business',
      component: RouterView,
      redirect: '/order/business/list',
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
            isBack: false,
          },
          hidden: true,
          name: 'order_business',
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/order/business/Detail'),
          meta: { title: '业务订单详情', activeMenu: '/order/business' },
          hidden: true,
          props: true,
          name: 'order_business_detail',
        },
      ],
    },
    {
      path: 'prescription',
      component: RouterView,
      redirect: '/order/prescription/list',
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
            isBack: false,
          },
          hidden: true,
          name: 'order_prescription',
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/order/prescription/Detail'),
          meta: { title: '处方详情', activeMenu: '/order/prescription' },
          hidden: true,
          props: true,
          name: 'order_prescription_detail',
        },
      ],
    },
    {
      path: 'prescription-order',
      component: RouterView,
      redirect: '/order/prescription-order/list',
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
            isBack: false,
          },
          hidden: true,
          name: 'order_prescriptionOrder',
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
          name: 'order_prescriptionOrder_detail',
        },
        {
          path: '/prescriptionDetails/:id',
          component: () => import('@/views/prescription/detail'),
          meta: {
            title: '已通过处方详情',
          },
          hidden: true,
          props: true,
          name: 'order_prescriptionOrder_prescriptionDetails',
        },
      ],
    },
    {
      path: 'hcReservations',
      component: RouterView,
      meta: {
        title: '心咨预约单',
        roles: ['XZ_ORG_XZ_ORDER_XZ_ORDER_RESERVED'],
      },
      redirect: '/order/hcReservations/hcReservationsList',
      children: [
        {
          path: 'hcReservationsList',
          component: () =>
            import('@/views/pharmacy-order/hcReservationsList.vue'),
          meta: {
            activeMenu: '/order/hcReservations',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
          name: 'order_hcReservations_list',
        },
        {
          path: 'hcReservationsDetail',
          component: () =>
            import('@/views/pharmacy-order/hcReservationsDetail.vue'),
          meta: { activeMenu: '/order/hcReservations' },
          name: 'order_hcReservations_detail',
          props: true,
          hidden: true,
        },
      ],
    },
    {
      path: 'hcOrder',
      component: () => import('@/views/pharmacy-order/hcOrder.vue'),
      meta: {
        title: '心咨订单',
        roles: ['XZ_ORG_XZ_ORDER_XZ_ORDER_RECORD'],
      },
    },
    {
      path: 'hcBackOrder',
      component: () => import('@/views/pharmacy-order/hcBackOrder.vue'),
      meta: {
        title: '后台订单',
        roles: ['XZ_ORG_XZ_ORDER_XZ_NOPAY_ORDER_RECORD'],
      },
    },
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

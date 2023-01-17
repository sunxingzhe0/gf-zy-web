/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'

export default {
  path: '/pharmacyorder',
  component: Layout,
  redirect: '/pharmacyorder/allorder',
  name: 'pharmacyorder',
  alwaysShow: true,
  meta: {
    title: '订单',
    icon: 'sidebar-order',
    roles: ['yaofang'],
  },
  children: [
    {
      path: 'allorder',
      name: 'pharmacyorder_allorder',
      component: RouterView,
      meta: { title: '全部订单' },
      redirect: '/pharmacyorder/allorder/orderList',
      children: [
        {
          path: 'orderList',
          name: 'pharmacyorder_allorder_orderList',
          component: () => import('@/views/pharmacy-order/AllOrder.vue'),
          meta: {
            activeMenu: '/pharmacyorder/allorder',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
        },
        {
          path: 'orderdetail',
          name: 'pharmacyorder_allorder_orderdetail',
          component: () => import('@/views/pharmacy-order/OrderDetail.vue'),
          props: true,
          hidden: true,
        },
      ],
    },
    {
      path: 'tocarryorder',
      name: 'pharmacyorder_tocarryorder',
      component: () => import('@/views/pharmacy-order/ToCarryOrder.vue'),
      meta: { title: '待自提订单' },
    },
    {
      path: 'tosendorder',
      name: 'pharmacyorder_tosendorder',
      component: () => import('@/views/pharmacy-order/ToSendOrder.vue'),
      meta: { title: '待发货订单' },
    },
  ],
}

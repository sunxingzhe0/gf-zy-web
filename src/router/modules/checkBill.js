/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/checkBill',
  component: Layout,
  redirect: '/checkBill/overview',
  name: 'checkBill',
  alwaysShow: true,
  meta: {
    title: '对账',
    icon: 'sidebar-order',
    roles: ['ZY_ORG_RECONCILIATION'],
  },
  children: [
    {
      path: 'overview',
      component: () => import('@/views/zy-page/reconciliation/overview.vue'),
      name: 'checkBill_overview',
      meta: { title: '概览', roles: ['ZY_ORG_RECONCILIATION_OVERVIEW'] },
    },
    {
      path: 'query',
      component: RouterView,
      redirect: '/checkBill/query/list',
      meta: {
        title: '账单核对',
        roles: ['ZY_ORG_RECONCILIATION_BILL_RECONCILIATION'],
      },
      children: [
        {
          path: 'list',
          component: () =>
            import('@/views/zy-page/reconciliation/salesData/query.vue'),
          hidden: true,
          meta: {
            title: '账单核对',
            activeMenu: '/checkBill/query',
            keepAlive: true,
            isBack: false,
          },
          name: 'checkBill_query',
        },
        {
          path: 'detail',
          component: () =>
            import('@/views/zy-page/reconciliation/salesData/queryDetail.vue'),
          hidden: true,
          meta: {
            title: '账单核对明细',
            activeMenu: '/checkBill/query',
          },
          name: 'checkBill_query_detail',
        },
      ],
    },
    {
      path: 'salesData',
      component: RouterView,
      redirect: '/checkBill/salesData/list',
      meta: {
        title: '平台订单',
        roles: ['ZY_ORG_RECONCILIATION_SALE'],
      },
      children: [
        {
          path: 'list',
          component: () =>
            import('@/views/zy-page/reconciliation/salesData/list.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/checkBill/salesData',
          },
          name: 'checkBill_salesData',
        },
        // {
        //   path: 'query',
        //   component: () =>
        //     import('@/views/zy-page/reconciliation/salesData/query.vue'),
        //   hidden: true,
        //   meta: {
        //     title: '账单核对',
        //     activeMenu: '/reconciliation/salesData',
        //   },
        // },
      ],
    },

    {
      path: 'fund-flow',
      component: RouterView,
      redirect: '/checkBill/fund-flow/list',
      meta: {
        title: '第三方流水',
        roles: ['ZY_ORG_RECONCILIATION_FOUND_FLOW'],
      },
      children: [
        {
          path: 'list',
          hidden: true,
          meta: {
            title: '',
            activeMenu: '/checkBill/fund-flow',
            keepAlive: true,
            isBack: false,
          },
          name: 'checkBill_fundFlow',
          component: () =>
            import('@/views/zy-page/reconciliation/fund-flow/index.vue'),
        },
        {
          path: 'detail',
          hidden: true,
          meta: { title: '银行流水明细', activeMenu: '/checkBill/fund-flow' },
          name: 'checkBill_fundFlow_detail',
          component: () =>
            import('@/views/zy-page/reconciliation/fund-flow/detail.vue'),
        },
        {
          path: 'zfbDetail',
          hidden: true,
          meta: { title: '支付宝流水明细', activeMenu: '/checkBill/fund-flow' },
          name: 'checkBill_fundFlow_zfbDetail',
          component: () =>
            import('@/views/zy-page/reconciliation/fund-flow/zfbDetail.vue'),
        },
      ],
    },

    {
      path: 'refund',
      meta: {
        title: '退款管理',
        roles: ['ZY_ORG_RECONCILIATION_REFUND_MANAGE'],
      },
      name: 'checkBill_refund',
      component: () =>
        import('@/views/zy-page/reconciliation/refunds/index.vue'),
    },
  ],
}

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
// import RouterView from '@/components/RouterView'
export default {
  path: '/reconciliation',
  component: Layout,
  redirect: '/reconciliation/salesData',
  name: 'reconciliation',
  alwaysShow: true,
  meta: {
    title: '对账',
    icon: 'statistics-order',
    roles: ['ZY_ORG_ACCOUNT_RECORD'],
  },
  children: [
    {
      path: 'salesData',
      component: () => import('@/views/zy-page/reconciliation/SalesData.vue'),
      name: 'salesData',
      meta: { title: '销售数据', roles: ['ZY_ORG_ACCOUNT_RECORD_SALE'] },
    },
  ],
}

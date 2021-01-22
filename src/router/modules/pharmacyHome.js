/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'

export default {
  path: '/home',
  component: Layout,
  redirect: '/home/workbench',
  name: 'HomeModules',
  alwaysShow: true,
  meta: {
    title: '首页',
    icon: 'sidebar-home',
    roles: ['DRUG_STORE_HOME_PAGE'],
  },
  children: [
    {
      path: 'workbench',
      component: () => import('@/views/pharmacy-home/workbench/WorkBench.vue'),
      meta: { title: '工作台', roles: ['DRUG_STORE_HOME_PAGE_WORKBENCH'] },
    },
    {
      path: 'writeoff',
      component: RouterView,
      meta: {
        title: '核销记录',
        roles: ['DRUG_STORE_HOME_PAGE_WRITE_OFF_RECORDS'],
      },
      redirect: '/home/writeoff/writeofflist',
      children: [
        {
          path: 'writeofflist',
          component: () =>
            import('@/views/pharmacy-home/writeofflist/WriteoffList.vue'),
          meta: { activeMenu: '/home/writeoff', keepAlive: true },
          hidden: true,
        },
        {
          path: 'detail/:id',
          component: () =>
            import('@/views/order/prescription-order/Detail.vue'),
          props: true,
          hidden: true,
        },
        {
          path: 'prescriptionDetails/:id',
          component: () => import('@/views/order/business/Detail'),
          meta: {
            title: '业务订单详情',
          },
          hidden: true,
          props: true,
        },
        {
          path: 'checkAccount/:id',
          component: () => import('@/views/jurisdiction/account/Detail'),
          props: true,
          meta: {
            title: '查看账号',
          },
          hidden: true,
        },
      ],
    },
  ],
}

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
      name: 'home_workbench',
      component: () => import('@/views/pharmacy-home/workbench/WorkBench.vue'),
      meta: {
        title: '工作台',
        roles: ['DRUG_STORE_HOME_PAGE_WORKBENCH'],
      },
    },
    {
      path: 'writeoff',
      component: RouterView,
      meta: {
        title: '核销记录',
        roles: ['DRUG_STORE_HOME_PAGE_WRITE_OFF_RECORDS'],
        keepAlive: true,
        isBack: false,
      },
      redirect: '/home/writeoff/writeofflist',
      children: [
        {
          path: 'writeofflist',
          name: 'home_writeoff',
          component: () =>
            import('@/views/pharmacy-home/writeofflist/WriteoffList.vue'),
          meta: { activeMenu: '/home/writeoff', keepAlive: true },
          hidden: true,
        },
        {
          path: 'detail/:id',
          name: 'home_writeoff_detail',
          component: () =>
            import('@/views/order/prescription-order/Detail.vue'),
          props: true,
          meta: { activeMenu: '/home/writeoff', title: '核销记录详情' },
          hidden: true,
        },
        {
          path: 'prescriptionDetails/:id',
          name: 'home_writeoff_prescriptionDetails',
          component: () => import('@/views/order/business/Detail'),
          meta: {
            title: '业务订单详情',
          },
          hidden: true,
          props: true,
        },
        {
          path: 'checkAccount/:id',
          name: 'home_writeoff_checkAccount',
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

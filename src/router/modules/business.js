/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'

export default {
  path: '/business',
  component: Layout,
  redirect: '/business/clinic',
  name: 'BusinessModules',
  alwaysShow: true,
  meta: {
    title: '业务',
    icon: 'sidebar-business',
    roles: ['DOC_WEB_BUSINESS', 'ORG_WEB_BUSINESS'],
  },
  children: [
    {
      path: 'clinic',
      component: () => import('@/views/business/clinic/index.vue'),
      meta: { title: '我的诊室', roles: ['DOC_WEB_BUSINESS_MY_CLINIC'] },
    },
    {
      path: 'order',
      component: RouterView,
      redirect: '/business/order/list',
      meta: { title: '订单管理', roles: ['DOC_WEB_BUSINESS_ORDER_MANAGEMENT'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/business/order/List.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/business/order',
            keepAlive: true,
          },
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/business/order/Detail.vue'),
          props: true,
          hidden: true,
          meta: { title: '订单详情页', activeMenu: '/business/order' },
        },
      ],
    },
    {
      path: 'prescription',
      component: RouterView,
      redirect: '/business/prescription/list',
      meta: { title: '我的处方', roles: ['DOC_WEB_BUSINESS_MY_PRESCRIPTION'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/business/prescription/List.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/business/prescription',
          },
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/business/prescription/Detail.vue'),
          props: true,
          hidden: true,
          meta: { title: '处方号详情页', activeMenu: '/business/prescription' },
        },
        {
          path: 'edit/:id',
          component: () => import('@/views/business/prescription/Detail.vue'),
          props: ({ params }) => ({ ...params, isEdit: true }),
          hidden: true,
          meta: { title: '修改处方', activeMenu: '/business/prescription' },
        },
      ],
    },

    {
      path: 'myHandle',
      component: () => import('@/views/business/myHandle/myHandle.vue'),
      meta: { title: '我的处置', roles: ['DOC_WEB_BUSINESS_MY_DISPOSE'] },
    },
    {
      path: 'consult',
      component: () =>
        import('@/views/business/InstitutionalConfiguration/List.vue'),
      props: { type: 'CONSULT' },
      meta: {
        title: '在线咨询',
        roles: ['ORG_WEB_BUSINESS_ONLINE_CONSULTATION'],
        keepAlive: true,
      },
    },
    {
      path: 'repeat_clinic',
      component: () =>
        import('@/views/business/InstitutionalConfiguration/List.vue'),
      props: { type: 'REPEAT_CLINIC' },
      meta: {
        title: '在线复诊',
        roles: ['ORG_WEB_BUSINESS_ONLINE_REFERRAL'],
        keepAlive: true,
      },
    },
    {
      path: 'carryon_presc',
      component: () =>
        import('@/views/business/InstitutionalConfiguration/List.vue'),
      props: { type: 'CARRYON_PRESC' },
      meta: {
        title: '慢病续方',
        roles: ['ORG_WEB_BUSINESS_CONTINUED_PRESCRIPTION'],
        keepAlive: true,
        // roles: ['ORG_WEB_BUSINESS_CONTINUED_PRESCRIPTION_FOR_CHRONIC_DISEASES'],
      },
    },
    // {
    //   path: 'patient',
    //   component: () => import('@/views/business/patient/List.vue'),
    //   meta: {
    //     title: '患者管理',
    //     keepAlive: true,
    //     // roles: ['ORG_WEB_BUSINESS_USER_MANAGEMENT'],
    //   },
    // },
    // {
    //   path: 'usermanagement',
    //   component: () =>
    //     import('@/views/business/Usermanagement/Institutionalusers.vue'),
    //   meta: {
    //     title: '用户管理',
    //     keepAlive: true,
    //   },
    // },
  ],
}

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
      name: 'business_clinic',
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
            isBack: false,
          },
          name: 'business_order',
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/business/order/Detail.vue'),
          props: true,
          hidden: true,
          meta: { title: '订单详情页', activeMenu: '/business/order' },
          name: 'business_order_detail',
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
            keepAlive: true,
            isBack: false,
          },
          name: 'business_prescription',
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/business/prescription/Detail.vue'),
          props: true,
          hidden: true,
          meta: { title: '处方号详情页', activeMenu: '/business/prescription' },
          name: 'business_prescription_detail',
        },
        {
          path: 'edit/:id',
          component: () => import('@/views/business/prescription/Detail.vue'),
          props: ({ params }) => ({ ...params, isEdit: true }),
          hidden: true,
          meta: { title: '修改处方', activeMenu: '/business/prescription' },
          name: 'business_prescription_edit',
        },
      ],
    },

    {
      path: 'myHandle',
      component: () => import('@/views/business/myHandle/myHandle.vue'),
      meta: { title: '我的处置', roles: ['DOC_WEB_BUSINESS_MY_DISPOSE'] },
      name: 'business_myHandle',
    },
    {
      path: 'consult',
      component: () =>
        import('@/views/business/InstitutionalConfiguration/List.vue'),
      props: { type: 'CONSULT' },
      meta: {
        title: '在线咨询',
        roles: ['ORG_WEB_BUSINESS_ONLINE_CONSULTATION'],
      },
      name: 'business_consult',
    },
    {
      path: 'repeat_clinic',
      component: () =>
        import('@/views/business/InstitutionalConfiguration/List.vue'),
      props: { type: 'REPEAT_CLINIC' },
      meta: {
        title: '在线复诊',
        roles: ['ORG_WEB_BUSINESS_ONLINE_REFERRAL'],
      },
      name: 'business_repeatClinic',
    },
    {
      path: 'carryon_presc',
      component: () =>
        import('@/views/business/InstitutionalConfiguration/List.vue'),
      props: { type: 'CARRYON_PRESC' },
      meta: {
        title: '慢病续方',
        roles: ['ORG_WEB_BUSINESS_CONTINUED_PRESCRIPTION'],
        // roles: ['ORG_WEB_BUSINESS_CONTINUED_PRESCRIPTION_FOR_CHRONIC_DISEASES'],
      },
      name: 'business_carryonPresc',
    },
    {
      path: 'report_read',
      component: () =>
        import('@/views/business/InstitutionalConfiguration/List.vue'),
      props: { type: 'REPORT_READ' },
      meta: {
        title: '报告解读',
        roles: ['ORG_WEB_BUSINESS_CONTINUED_PRESCRIPTION'],
        // roles: ['ORG_WEB_BUSINESS_CONTINUED_PRESCRIPTION_FOR_CHRONIC_DISEASES'],
      },
      name: 'business_reportRead',
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

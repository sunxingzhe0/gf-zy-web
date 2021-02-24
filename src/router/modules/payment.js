/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/payment',
  component: Layout,
  redirect: '/payment/reg',
  name: 'payment',
  alwaysShow: true,
  meta: {
    title: '缴费',
    icon: 'sidebar-amount',
    roles: ['ZY_ORG_PAY'],
  },
  children: [
    {
      path: 'reg',
      component: RouterView,
      redirect: '/payment/reg/list',
      name: 'reg',
      meta: { title: '预约挂号', roles: ['ZY_ORG_PAY_APPOINTMENT'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/zy-page/payment/RegList.vue'),
          hidden: true,
          meta: { title: '列表', activeMenu: '/payment/reg', keepAlive: true },
        },
        {
          path: 'detail',
          component: () => import('@/views/zy-page/payment/RegDetail.vue'),
          hidden: true,
          meta: { title: '详情', activeMenu: '/payment/reg' },
        },
      ],
    },
    {
      path: 'out-patient',
      component: RouterView,
      redirect: '/payment/out-patient/list',
      name: 'out-patient',
      meta: { title: '门诊缴费', roles: ['ZY_ORG_PAY_OUTPATIENT'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/zy-page/payment/OutPatientList.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/payment/out-patient',
            keepAlive: true,
          },
        },
        {
          path: 'detail',
          component: () =>
            import('@/views/zy-page/payment/OutPatientDetail.vue'),
          hidden: true,
          meta: { title: '详情', activeMenu: '/payment/out-patient' },
        },
      ],
    },
    {
      path: 'in-patient',
      component: RouterView,
      redirect: '/payment/in-patient/list',
      name: 'in-patient',
      meta: { title: '住院缴费', roles: ['ZY_ORG_PAY_INHOSPITAL'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/zy-page/payment/InPatientList.vue'),
          hidden: true,
          meta: { title: '列表', activeMenu: '/payment/in-patient' },
        },
      ],
    },
    {
      path: 'appointment',
      component: RouterView,
      redirect: '/payment/appointment/list',
      name: 'appointment',
      meta: { title: '预约体检', roles: ['ZY_ORG_PAY_EXAM_APPO'] },
      children: [
        {
          path: 'list',
          component: () =>
            import('@/views/zy-page/payment/AppointmentList.vue'),
          hidden: true,
          meta: { title: '列表', activeMenu: '/payment/appointment' },
        },
        {
          path: 'detail',
          component: () => import('@/views/zy-page/payment/RegDetail.vue'),
          hidden: true,
          meta: { title: '详情', activeMenu: '/payment/appointment' },
        },
      ],
    },
    {
      path: 'body',
      component: RouterView,
      redirect: '/payment/body/list',
      name: 'body',
      meta: { title: '体检缴费', roles: ['ZY_ORG_PAY_EXAM_PAY'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/zy-page/payment/BodyList.vue'),
          hidden: true,
          meta: { title: '列表', activeMenu: '/payment/body' },
        },
        {
          path: 'detail',
          component: () => import('@/views/zy-page/payment/BodyDetail.vue'),
          hidden: true,
          meta: { title: '详情', activeMenu: '/payment/body' },
        },
      ],
    },
  ],
}

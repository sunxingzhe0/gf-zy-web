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
      meta: { title: '预约挂号', roles: ['ZY_ORG_PAY_APPOINTMENT'] },
      children: [
        {
          path: 'list',
          name: 'payment_reg',
          component: () => import('@/views/zy-page/payment/RegList.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/payment/reg',
            keepAlive: true,
            isBack: false,
          },
        },
        {
          path: 'detail',
          name: 'payment_reg_detail',
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
      meta: { title: '门诊缴费', roles: ['ZY_ORG_PAY_OUTPATIENT'] },
      children: [
        {
          path: 'list',
          name: 'payment_outPatient',
          component: () => import('@/views/zy-page/payment/OutPatientList.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/payment/out-patient',
            keepAlive: true,
            isBack: false,
          },
        },
        {
          path: 'detail',
          name: 'payment_outPatient_detail',
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
      meta: { title: '住院缴费', roles: ['ZY_ORG_PAY_INHOSPITAL'] },
      children: [
        {
          path: 'list',
          name: 'payment_inPatient',
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
      meta: { title: '预约体检', roles: ['ZY_ORG_PAY_EXAM_APPO'] },
      children: [
        {
          path: 'list',
          name: 'payment_appointment',
          component: () =>
            import('@/views/zy-page/payment/AppointmentList.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/payment/appointment',
            keepAlive: true,
            isBack: false,
          },
        },
        {
          path: 'detail',
          name: 'payment_appointment_detail',
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
      meta: { title: '体检缴费', roles: ['ZY_ORG_PAY_EXAM_PAY'] },
      children: [
        {
          path: 'list',
          name: 'payment_body',
          component: () => import('@/views/zy-page/payment/BodyList.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/payment/body',
            keepAlive: true,
            isBack: false,
          },
        },
        {
          path: 'detail',
          name: 'payment_body_detail',
          component: () => import('@/views/zy-page/payment/BodyDetail.vue'),
          hidden: true,
          meta: { title: '详情', activeMenu: '/payment/body' },
        },
      ],
    },
  ],
}

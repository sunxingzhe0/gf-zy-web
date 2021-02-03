/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/patient',
  component: Layout,
  redirect: '/patient/blacklist',
  name: 'PatientModules',
  alwaysShow: true,
  meta: {
    title: '用户',
    icon: 'sidebar-patient',
    roles: ['DOC_WEB_PATIENT', 'ZY_ORG_PATIENT', 'ORG_WEB_USER_MENU'],
  },
  children: [
    {
      path: 'mine',
      component: RouterView,
      redirect: '/patient/mine/list',
      meta: { title: '我的患者', roles: ['DOC_WEB_PATIENT_MY_PATIENTS'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/patient/mine/List.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/patient/mine',
          },
        },
        {
          path: 'detail/:id&:patientId',
          component: () => import('@/views/patient/mine/Detail.vue'),
          props: true,
          hidden: true,
          meta: { title: '患者详情', activeMenu: '/patient/mine' },
        },
        {
          path: 'roominfo/:sessionId&:clinicId&:userId',
          component: () => import('@/views/patient/mine/roominfo.vue'),
          hidden: true,
          meta: {
            title: '诊室记录详情',
            activeMenu: '/patient/mine',
          },
        },
        {
          path: 'recordInfo',
          name: 'recordInfo',
          component: () => import('@/views/patient/mine/recordInfo.vue'),
          hidden: true,
          meta: {
            title: '就诊记录详情',
            activeMenu: '/patient/mine',
          },
        },
      ],
    },
    {
      path: 'push',
      name: 'pushList',
      component: () => import('@/views/patient/Push.vue'),
      meta: { title: '我的推送', roles: ['DOC_WEB_PATIENT_MY_PUSH'] },
    },
    {
      path: 'patientTube',
      component: RouterView,
      redirect: '/patient/patientTube/list',
      meta: { title: '患者管理', roles: ['ORG_WEB_USER_MENU_USER_MANAGEMENT'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/patient/mine/List.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/patient/patientTube',
          },
        },
        {
          path: 'detail/:id&:patientId',
          component: () => import('@/views/patient/mine/Detail.vue'),
          props: true,
          hidden: true,
          meta: { title: '患者详情', activeMenu: '/patient/patientTube' },
        },
        {
          path: 'roominfo/:sessionId&:clinicId&:userId',
          component: () => import('@/views/patient/mine/roominfo.vue'),
          hidden: true,
          meta: {
            title: '诊室记录详情',
            activeMenu: '/patient/patientTube',
          },
        },
        {
          path: 'recordInfo',
          name: 'recordInfo',
          component: () => import('@/views/patient/mine/recordInfo.vue'),
          hidden: true,
          meta: {
            title: '就诊记录详情',
            activeMenu: '/patient/patientTube',
          },
        },
      ],
    },
    {
      path: 'usermanagement',
      component: () => import('@/views/patient/mine/Institutionalusers.vue'),
      meta: { title: '用户管理', roles: ['ORG_WEB_USER_MENU_USER_MANAGEMENT'] },
    },
    /*       {
      path: 'blacklist',
      name: 'blacklist',
      component: () => import('@/views/zy-page/patient/Blacklist.vue'),
      meta: { title: '黑名单管理', roles: ['ZY_ORG_PATIENT_BLACK'] },
    }, */
  ],
}

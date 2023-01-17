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
    roles: [
      'DOC_WEB_PATIENT',
      'ZY_ORG_PATIENT',
      'ORG_WEB_USER_MENU',
      'XZ_ORG_XZ_USER',
    ],
  },
  children: [
    {
      path: 'mine',
      component: RouterView,
      redirect: '/patient/mine/list',
      meta: {
        title: '我的患者',
        roles: ['DOC_WEB_PATIENT_MY_PATIENTS', 'XZ_ORG_XZ_USER_XZ_MY_PATIENT'],
        keepAlive: true,
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/patient/mine/index.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/patient/mine',
            keepAlive: true,
            isBack: false,
          },
          name: 'patient_mine',
        },
        {
          path: 'mindDetail',
          name: 'patient_mine_mindDetail',
          component: () => import('@/views/patient/mine/MindDetail.vue'),
          props: true,
          hidden: true,
          meta: {
            title: '心咨患者详情',
            activeMenu: '/patient/mine/mindDetail',
            keepAlive: true,
            isBack: false,
          },
        },
        {
          path: 'detail',
          component: RouterView,
          props: true,
          hidden: true,
          redirect: '/patient/mine/detail/detail',
          meta: {
            title: '患者详情',
            activeMenu: '/patient/mine',
            keepAlive: true,
            isBack: false,
          },
          children: [
            {
              path: 'detail',
              name: 'patient_mine_detail',
              component: () => import('@/views/patient/mine/Detail.vue'),
              props: true,
              hidden: true,
              meta: { keepAlive: true, activeMenu: '/patient/mine' },
            },
            {
              path: 'roominfo',
              name: 'patient_mine_detail_roominfo',
              component: () => import('@/views/patient/mine/roominfo.vue'),
              hidden: true,
              meta: {
                title: '诊室记录详情',
                activeMenu: '/patient/mine',
              },
            },
            {
              path: 'recordInfo',
              name: 'patient_mine_detail_recordInfo',
              component: () => import('@/views/patient/mine/recordInfo.vue'),
              hidden: true,
              meta: {
                title: '就诊记录详情',
                activeMenu: '/patient/mine',
              },
            },
          ],
        },
      ],
    },
    {
      path: 'push',
      name: 'patient_pushList',
      component: () => import('@/views/patient/Push.vue'),
      meta: { title: '我的推送', roles: ['DOC_WEB_PATIENT_MY_PUSH'] },
    },
    {
      path: 'patientTube',
      component: RouterView,
      redirect: '/patient/patientTube/list',
      meta: {
        keepAlive: true,
        title: '患者管理',
        roles: [
          'ORG_WEB_USER_MENU_USER_MANAGEMENT',
          'XZ_ORG_XZ_USER_XZ_PATIENT',
        ],
      },
      children: [
        {
          path: 'list',
          name: 'patient_mine',
          component: () => import('@/views/patient/mine/index.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/patient/patientTube',
            keepAlive: true,
            isBack: false,
          },
        },
        {
          path: 'mindDetail',
          name: 'patient_mine_mindDetail',
          component: () => import('@/views/patient/mine/MindDetail.vue'),
          hidden: true,
          meta: {
            title: '心咨患者详情',
            activeMenu: '/patient/patientTube/mindDetail',
            keepAlive: true,
            isBack: false,
          },
        },
        {
          path: 'detail',
          component: RouterView,
          props: true,
          hidden: true,
          redirect: '/patient/patientTube/detail/detail',
          meta: {
            keepAlive: true,
            isBack: false,
            title: '患者详情',
            activeMenu: '/patient/patientTube',
          },
          children: [
            {
              path: 'detail',
              name: 'patient_mine_detail',
              component: () => import('@/views/patient/mine/Detail.vue'),
              props: true,
              hidden: true,
              meta: { keepAlive: true, activeMenu: '/patient/patientTube' },
            },
            {
              path: 'roominfo',
              name: 'patient_mine_detail_roominfo',
              component: () => import('@/views/patient/mine/roominfo.vue'),
              hidden: true,
              meta: {
                title: '诊室记录详情',
                activeMenu: '/patient/patientTube',
              },
            },
            {
              path: 'recordInfo',
              name: 'patient_mine_detail_recordInfo',
              component: () => import('@/views/patient/mine/recordInfo.vue'),
              hidden: true,
              meta: {
                title: '就诊记录详情',
                activeMenu: '/patient/patientTube',
              },
            },
          ],
        },
      ],
    },
    {
      path: 'usermanagement',
      name: 'patient_usermanagement',
      component: () => import('@/views/patient/mine/Institutionalusers.vue'),
      meta: { title: '用户管理', roles: ['ORG_WEB_USER_MENU_USER_MANAGEMENT'] },
    },
    {
      path: 'blacklist',
      name: 'patient_blacklist',
      component: () => import('@/views/zy-page/patient/Blacklist.vue'),
      meta: { title: '黑名单管理', roles: ['ZY_ORG_PATIENT_BLACK'] },
    },
    {
      path: 'blacklist_xz',
      name: 'patient_blacklist_xz',
      component: () => import('@/views/mindConsult/blacklist/index'),
      meta: { title: '心咨黑名单', roles: ['XZ_ORG_XZ_USER_XZ_BLACK'] },
    },
  ],
}

/** 机构 **/

import Layout from '@/components/layout'
export default {
  path: '/mechanism',
  component: Layout,
  redirect: '/mechanism/mechanismList',
  name: 'MechanisModules',
  alwaysShow: true,
  meta: {
    title: '机构',
    icon: 'sidebar-org',
    roles: ['PLATFORM'],
  },
  children: [
    {
      path: 'mechanismList',
      component: () => import('@/views/mechanism/mechanismList.vue'),
      meta: { title: '机构管理' /* roles: ['PLATFORM'] */ },
      name: 'mechanism_mechanismList',
    },
    {
      path: 'mechanismInfo',
      component: () => import('@/views/mechanism/mechanismInfo.vue'),
      meta: { title: '个人信息' /* roles: ['PLATFORM'] */ },
      name: 'mechanism_mechanismInfo',
    },
    {
      path: 'appletMange',
      component: () => import('@/views/mechanism/appletMange.vue'),
      meta: { title: '小程序管理' /* roles: ['PLATFORM'] */ },
      name: 'mechanism_appletMange',
    },
  ],
}

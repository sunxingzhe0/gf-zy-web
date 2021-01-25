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
    // roles: ['DOC_WEB_PATIENT'],
  },
  children: [
    {
      path: 'mechanismList',
      component: () => import('@/views/mechanism/mechanismList.vue'),
      meta: { title: '机构管理' /* roles: ['DOC_WEB_PATIENT'] */ },
    },
  ],
}

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/message',
  component: Layout,
  redirect: '/message/systemMsg',
  name: 'MessageModules',
  alwaysShow: true,
  meta: {
    title: '消息',
    icon: 'navbar-message',
    roles: ['DRUG_DOC_NEWS'],
  },
  children: [
    {
      path: 'systemMsg',
      component: RouterView,
      name: 'systemMsg',
      redirect: '/message/systemMsg/list',
      meta: { title: '系统消息', roles: ['DRUG_DOC_NEWS_SYSTEM_MESSAGE'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/message/systemMsg/index'),
          meta: {
            title: '列表',
            activeMenu: '/message/systemMsg',
            keepAlive: true,
          },
          hidden: true,
        },
        {
          path: 'detail',
          component: () => import('@/views/message/systemMsg/detail'),
          meta: { title: '消息详情', activeMenu: '/message/systemMsg' },
          hidden: true,
        },
      ],
    },
    {
      path: 'notice',
      component: RouterView,
      redirect: '/message/notice/list',
      name: 'notice',
      meta: { title: '公告通知', roles: ['DRUG_DOC_NEWS_ANNOUNCEMENT_NOTICE'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/message/notice/list'),
          meta: {
            title: '列表',
            activeMenu: '/message/notice',
            keepAlive: true,
          },
          hidden: true,
        },
        {
          path: 'detail',
          component: () => import('@/views/message/notice/detail'),
          meta: { title: '通知详情', activeMenu: '/message/notice' },
          hidden: true,
        },
      ],
    },
  ],
}

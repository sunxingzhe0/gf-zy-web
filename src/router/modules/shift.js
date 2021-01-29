/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/shift',
  component: Layout,
  redirect: '/shift/scheduling',
  name: 'ShiftModules',
  alwaysShow: true,
  meta: {
    title: '排班',
    icon: 'sidebar-shift',
    roles: ['DOC_WEB_SCHEDULING', 'ORG_WEB_SCHEDULING'],
  },
  children: [
    {
      path: 'scheduling',
      component: () => import('@/views/scheduling/index'),
      name: 'scheduling',
      meta: {
        title: '我的排班',
        roles: ['DOC_WEB_SCHEDULING_SCHEDULING_INFORMATION'],
      },
    },
    {
      path: 'online-visit',
      component: RouterView,
      redirect: '/shift/online-visit/list',
      name: 'onlineVisit',
      meta: {
        title: '在线复诊',
        roles: ['ORG_WEB_SCHEDULING_ONLINE_REFERRAL'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/scheduling/online-visit/List'),
          meta: {
            title: '列表',
            activeMenu: '/shift/online-visit',
            keepAlive: true,
          },
          hidden: true,
        },
        {
          path: 'edit',
          component: () => import('@/views/scheduling/online-visit/Edit'),
          meta: {
            title: '科室排班',
            activeMenu: '/shift/online-visit',
          },
          hidden: true,
        },
      ],
    },
    {
      path: 'schedule-list',
      component: RouterView,
      redirect: '/shift/schedule-list/list',
      name: 'scheduleList',
      meta: { title: '排班表', roles: ['ORG_WEB_SCHEDULING_SCHEDULE'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/scheduling/schedule-list/List'),
          meta: {
            title: '列表',
            activeMenu: '/shift/schedule-list',
            keepAlive: true,
          },
          hidden: true,
        },
        {
          path: 'detail',
          component: () => import('@/views/scheduling/schedule-list/Detail'),
          meta: {
            title: '排班详情',
            activeMenu: '/shift/schedule-list',
          },
          hidden: true,
        },
      ],
    },
  ],
}

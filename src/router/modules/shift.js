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
      name: 'shift_scheduling',
      meta: {
        title: '我的排班',
        roles: ['DOC_WEB_SCHEDULING_SCHEDULING_INFORMATION'],
      },
    },
    {
      path: 'online-visit',
      component: RouterView,
      redirect: '/shift/online-visit/list',
      meta: {
        title: '在线复诊',
        roles: ['ORG_WEB_SCHEDULING_ONLINE_REFERRAL'],
      },
      children: [
        {
          path: 'list',
          name: 'shift_onlineVisit',
          component: () => import('@/views/scheduling/online-visit/List'),
          meta: {
            title: '列表',
            activeMenu: '/shift/online-visit',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
        },
        {
          path: 'edit',
          name: 'shift_onlineVisit_edit',
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
      meta: { title: '排班表', roles: ['ORG_WEB_SCHEDULING_SCHEDULE'] },
      children: [
        {
          path: 'list',
          name: 'shift_scheduleList',
          component: () => import('@/views/scheduling/schedule-list/List'),
          meta: {
            title: '列表',
            activeMenu: '/shift/schedule-list',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
        },
        {
          path: 'detail',
          name: 'shift_scheduleList_detail',
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

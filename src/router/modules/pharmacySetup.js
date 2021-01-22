/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/pharmacysetup',
  component: Layout,
  redirect: '/pharmacysetup/account',
  name: 'pharmacysetup',
  alwaysShow: true,
  meta: {
    title: '设置',
    icon: 'sidebar-set-up',
    roles: ['yaofang'],
  },
  children: [
    {
      path: 'account',
      component: () => import('@/views/pharmacy-setup/Account.vue'),
      meta: { title: '账号管理' },
    },
    {
      path: 'systeminfo',
      component: RouterView,
      meta: { title: '系统消息' },
      redirect: '/pharmacysetup/systeminfo/systeminfoList',
      children: [
        {
          path: 'systeminfoList',
          component: () => import('@/views/pharmacy-setup/SystemInfo.vue'),
          meta: { activeMenu: '/pharmacysetup/systeminfo', keepAlive: true },
          hidden: true,
        },
        {
          path: 'infodetail',
          component: () => import('@/views/pharmacy-setup/InfoDetail.vue'),
          props: true,
          hidden: true,
        },
      ],
    },

    {
      path: 'notice',
      component: RouterView,
      meta: { title: '公告通知' },
      redirect: '/pharmacysetup/notice/noticeList',
      children: [
        {
          path: 'noticeList',
          component: () => import('@/views/pharmacy-setup/Notice.vue'),
          meta: { activeMenu: '/pharmacysetup/notice', keepAlive: true },
          hidden: true,
        },
        {
          path: 'noticedetail',
          component: () => import('@/views/pharmacy-setup/NoticeDetail.vue'),
          props: true,
          hidden: true,
        },
      ],
    },
    {
      path: 'businesssetup',
      component: () => import('@/views/pharmacy-setup/BusinessSetup.vue'),
      meta: { title: '业务设置' },
    },
    {
      path: 'logmanage',
      component: () => import('@/views/pharmacy-setup/LogManage.vue'),
      meta: { title: '日志管理' },
    },
  ],
}

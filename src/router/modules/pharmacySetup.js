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
      name: 'pharmacysetup_account',
      component: () => import('@/views/pharmacy-setup/Account.vue'),
      meta: { title: '账号管理' },
    },
    {
      path: 'systeminfo',
      name: 'pharmacysetup_systeminfo',
      component: RouterView,
      meta: { title: '系统消息' },
      redirect: '/pharmacysetup/systeminfo/systeminfoList',
      children: [
        {
          path: 'systeminfoList',
          name: 'pharmacysetup_systeminfo_systeminfoList',
          component: () => import('@/views/pharmacy-setup/SystemInfo.vue'),
          meta: {
            activeMenu: '/pharmacysetup/systeminfo',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
        },
        {
          path: 'infodetail',
          name: 'pharmacysetup_systeminfo_infodetail',
          component: () => import('@/views/pharmacy-setup/InfoDetail.vue'),
          props: true,
          hidden: true,
        },
      ],
    },

    {
      path: 'notice',
      name: 'pharmacysetup_notice',
      component: RouterView,
      meta: { title: '公告通知' },
      redirect: '/pharmacysetup/notice/noticeList',
      children: [
        {
          path: 'noticeList',
          name: 'pharmacysetup_notice_noticeList',
          component: () => import('@/views/pharmacy-setup/Notice.vue'),
          meta: {
            activeMenu: '/pharmacysetup/notice',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
        },
        {
          path: 'noticedetail',
          name: 'pharmacysetup_notice_noticedetail',
          component: () => import('@/views/pharmacy-setup/NoticeDetail.vue'),
          props: true,
          hidden: true,
        },
      ],
    },
    {
      path: 'businesssetup',
      name: 'pharmacysetup_businesssetup',
      component: () => import('@/views/pharmacy-setup/BusinessSetup.vue'),
      meta: { title: '业务设置' },
    },
    {
      path: 'logmanage',
      name: 'pharmacysetup_logmanage',
      component: () => import('@/views/pharmacy-setup/LogManage.vue'),
      meta: { title: '日志管理' },
    },
  ],
}

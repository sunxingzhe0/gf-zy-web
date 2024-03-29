/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/set-up',
  component: Layout,
  redirect: '/set-up/account',
  name: 'SetUpModules',
  alwaysShow: true,
  meta: {
    title: '设置',
    icon: 'sidebar-set-up',
    roles: [
      'DOC_WEB_SET_UP',
      'DRUG_STORE_SET_UP',
      'ORG_WEB_SET_UP',
      'DRUG_DOC',
      'ZY_ORG_SETTING',
    ],
  },
  children: [
    {
      path: 'account',
      component: () => import('@/views/setUp/account/index'),
      name: 'setUp_account',
      meta: {
        title: '个人信息',
        roles: [
          'DOC_WEB_SET_UP_PERSONAL_INFORMATION',
          'DRUG_DOC_SET_UP_PERSONAL_INFORMATION',
          'DRUG_STORE_SET_UP_PERSONAL_INFORMATION',
          'DRUG_DOC_SET_UP_PERSONAL_INFORMATION',
          'ORG_WEB_SET_UP_PERSONAL_INFORMATION',
        ],
      },
    },
    {
      path: 'systemMsg',
      component: RouterView,
      redirect: '/set-up/systemMsg/list',
      meta: {
        title: '系统消息',
        isrolesM: true,
        roles: [
          'DOC_WEB_SET_UP_SYSTEM_MESSAGE',
          'ORG_WEB_SET_UP_SYSTEM_MESSAGE',
          'DRUG_STORE_SET_UP_SYSTEM_MESSAGE',
          'DRUG_DOC_NEWS_SYSTEM_MESSAGE',
        ],
        keepAlive: true,
      },
      children: [
        {
          path: 'list',
          name: 'message_systemMsg',
          component: () => import('@/views/message/systemMsg/index'),
          meta: {
            title: '列表',
            activeMenu: '/set-up/systemMsg',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
        },
        {
          path: 'detail',
          name: 'message_systemMsg_detail',
          component: () => import('@/views/message/systemMsg/detail'),
          meta: { title: '消息详情', activeMenu: '/set-up/systemMsg' },
          hidden: true,
        },
      ],
    },
    {
      path: 'notice',
      component: RouterView,
      redirect: '/set-up/notice/list',
      meta: {
        title: '公告通知',
        isrolesM: true,
        roles: [
          'DOC_WEB_SET_UP_ANNOUNCEMENT_NOTICE',
          'DRUG_STORE_SET_UP_ANNOUNCEMENT_NOTICE',
          'DRUG_STORE_SET_UP_ANNOUNCEMENT_NOTICE',
          'DRUG_DOC_NEWS_ANNOUNCEMENT_NOTICE',
        ],
      },
      children: [
        {
          path: 'list',
          name: 'message_notice',
          component: () => import('@/views/message/notice/list'),
          meta: {
            title: '列表',
            activeMenu: '/set-up/notice',
            keepAlive: true,
            isBack: false,
          },

          hidden: true,
        },
        {
          path: 'detail',
          name: 'message_notice_detail',
          component: () => import('@/views/message/notice/detail'),
          meta: { title: '通知详情', activeMenu: '/set-up/notice' },
          hidden: true,
        },
      ],
    },
    // {
    //   path: 'account-single',
    //   component: () => import('@/views/setUp/account/password'),
    //   name: 'account',
    //   meta: {
    //     title: '密码管理',
    //     roles: ['ORG_WEB_SET_UP_PASSWORD_MANAGEMENT'],
    //   },
    // },
    {
      path: 'announcements',
      component: RouterView,
      redirect: '/set-up/announcements/list',
      meta: { title: '公告管理', roles: ['ORG_WEB_SET_UP_ANNOUNCE'] },
      children: [
        {
          path: 'list',
          name: 'setUp_announcements',
          component: () => import('@/views/setUp/announcements/List'),
          meta: {
            title: '列表',
            activeMenu: '/set-up/announcements',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
        },
        {
          path: 'add',
          name: 'setUp_announcements_add',
          component: () => import('@/views/setUp/announcements/Add'),
          meta: { title: '新增公告', activeMenu: '/set-up/announcements' },
          hidden: true,
        },
        {
          path: 'edit',
          name: 'setUp_announcements_edit',
          component: () => import('@/views/setUp/announcements/Add'),
          meta: { title: '编辑公告', activeMenu: '/set-up/announcements' },
          hidden: true,
        },
        {
          path: 'detail',
          name: 'setUp_announcements_detail',
          component: () => import('@/views/setUp/announcements/Detail'),
          meta: { title: '公告详情', activeMenu: '/set-up/announcements' },
          hidden: true,
        },
      ],
    },
    {
      path: 'journal',
      component: () => import('@/views/setUp/journal/index'),
      name: 'setUp_journal',
      meta: {
        title: '日志管理',
        roles: [
          'DOC_WEB_SET_UP_LOG_MANAGEMENT',
          'DRUG_STORE_SET_UP',
          'ORG_WEB_SET_UP_LOG_MANAGEMENT',
          'DRUG_DOC',
        ],
      },
    },
    {
      path: 'business',
      component: () => import('@/views/setUp/business/list'),
      name: 'setUp_business',
      meta: {
        title: '业务设置',
        roles: [
          'DOC_WEB_SET_UP_BUSINESS_SETTINGS',
          'DRUG_STORE_SET_UP',
          'ORG_WEB_SET_UP_BUSINESS_SETTINGS',
          // 'DRUG_DOC',
        ],
      },
    },
    {
      path: 'agreement',
      component: () => import('@/views/setUp/agreement/index'),
      name: 'setUp_agreement',
      meta: {
        title: '协议须知',
        roles: [
          'ORG_WEB_SET_UP_PROTOCOL_MANAGEMENT',
          'ZY_ORG_SETTING_XUZHI_MANAGEMENT',
        ],
      },
    },

    {
      path: 'ad-rotation',
      component: () => import('@/views/setUp/ad-rotation/List'),
      name: 'setUp_adRotation',
      meta: { title: '广告轮播', roles: ['ORG_WEB_SET_UP_AD_ROTATION'] },
    },
    {
      path: 'column',
      component: () => import('@/views/setUp/column/List'),
      name: 'setUp_column',
      meta: { title: '首页栏目', roles: ['ORG_WEB_SET_UP_HOME_PAGE_COLUMN'] },
    },
    {
      path: 'information',
      component: RouterView,
      redirect: '/set-up/information/list',
      meta: {
        title: '资讯管理',
        roles: ['ORG_WEB_SET_UP_INFORMATION_MANAGEMENT'],
      },
      children: [
        {
          path: 'list',
          name: 'setUp_information',
          component: () => import('@/views/setUp/information/List'),
          meta: {
            title: '列表',
            activeMenu: '/set-up/information',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
        },
        {
          path: 'add',
          name: 'setUp_information_add',
          component: () => import('@/views/setUp/information/Add'),
          meta: { title: '新增资讯', activeMenu: '/set-up/information' },
          hidden: true,
        },
        {
          path: 'edit',
          name: 'setUp_information_detail',
          component: () => import('@/views/setUp/information/Add'),
          meta: { title: '编辑资讯', activeMenu: '/set-up/information' },
          hidden: true,
        },
        {
          path: 'detail',
          name: 'setUp_information_detail',
          component: () => import('@/views/setUp/information/Detail'),
          meta: { title: '资讯详情', activeMenu: '/set-up/information' },
          hidden: true,
        },
      ],
    },

    // {
    //   path: 'ghNotice',
    //   component: () => import('@/views/zy-page/setUp/ghNotice'),
    //   name: 'tjNotice',
    //   meta: {
    //     title: '须知管理',
    //     roles: ['ZY_ORG_SETTING_XUZHI_MANAGEMENT'],
    //   },
    // },
  ],
}

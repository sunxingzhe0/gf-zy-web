/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/reconciliation',
  component: Layout,
  redirect: '/reconciliation/salesData',
  name: 'reconciliation',
  alwaysShow: true,
  meta: {
    title: '记录',
    icon: 'sidebar-order',
    roles: ['ZY_ORG_ACCOUNT_RECORD', 'XZ_ORG_XZ_RECORD'],
  },
  children: [
    {
      path: 'overview',
      name: 'reconciliation_overview',
      component: () => import('@/views/zy-page/reconciliation/overview.vue'),
      meta: { title: '概览', roles: ['ZY_ORG_ACCOUNT_RECORD_OVERVIEW'] },
    },
    {
      path: 'salesData',
      component: RouterView,
      redirect: '/reconciliation/salesData/list',
      meta: {
        title: '缴费数据',
        roles: ['ZY_ORG_ACCOUNT_RECORD_SALE'],
      },
      children: [
        {
          path: 'list',
          name: 'checkBill_salesData',
          component: () =>
            import('@/views/zy-page/reconciliation/salesData/list.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/reconciliation/salesData',
            keepAlive: true,
            isBack: false,
          },
        },
        {
          path: 'query',
          name: 'checkBill_salesData_query',
          component: () =>
            import('@/views/zy-page/reconciliation/salesData/query.vue'),
          hidden: true,
          meta: {
            title: '对账',
            activeMenu: '/reconciliation/salesData',
          },
        },
      ],
    },
    {
      path: 'feedback',
      name: 'reconciliation_feedback',
      component: () => import('@/views/setUp/feedback/index'),
      meta: {
        title: '意见反馈',
        roles: ['ZY_ORG_ACCOUNT_RECORD_FEEDBACK'],
      },
    },
    {
      path: 'checkFormList',
      component: RouterView,
      redirect: '/reconciliation/checkFormList/list',
      meta: {
        title: '流调表记录',
        roles: ['ZY_ORG_ACCOUNT_RECORD_FLOW_STATISTICS'],
      },

      children: [
        {
          path: 'list',
          name: 'reconciliation_checkFormList',
          component: () => import('@/views/business/checkFormList/index.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/reconciliation/checkFormList',
            keepAlive: true,
            isBack: false,
          },
        },
        {
          path: 'detail',
          name: 'reconciliation_checkFormList_detail',
          component: () =>
            import('@/views/business/checkFormList/detail/index.vue'),
          hidden: true,
          meta: {
            title: '流调表',
            activeMenu: '/reconciliation/checkFormList',
          },
        },
      ],
    },
    {
      path: 'nucleicacid_appointment',
      component: RouterView,
      redirect: '/reconciliation/nucleicacid_appointment/list',
      meta: {
        title: '核酸检测预约',
        roles: ['ZY_ORG_ACCOUNT_RECORD_NUCLEIC_ACID'],
      },
      children: [
        {
          path: 'list',
          name: 'reconciliation_nucleicacidAppointment',
          component: () =>
            import('@/views/business/nucleicAcidAppointment/index.vue'),
          hidden: true,
          meta: {
            title: '列表',
            activeMenu: '/reconciliation/nucleicacid_appointment',
            keepAlive: true,
            isBack: false,
          },
        },
        {
          path: 'detail',
          name: 'reconciliation_nucleicacidAppointment_detail',
          component: () =>
            import('@/views/business/nucleicAcidAppointment/detail/index.vue'),
          hidden: true,
          meta: {
            title: '流调表',
            activeMenu: '/reconciliation/nucleicacid_appointment',
          },
        },
      ],
    },
    {
      path: 'registeDoctor',
      component: () => import('@/views/zy-page/statistics/registeDoctor.vue'),
      name: 'reconciliation_registeDoctor',
      meta: {
        title: '预约挂号记录',
        roles: ['ZY_ORG_ACCOUNT_RECORD_APPOINTMENT'],
      },
    },
    {
      path: 'signupRecord',
      component: () => import('@/views/mindConsult/signupRecord'),
      meta: {
        title: '全部团体报名',
        roles: ['XZ_ORG_XZ_RECORD_XZ_RECORD_SIGN'],
      },
      name: 'mindConsult_signupRecord',
    },
    {
      path: 'ToDayRegisteDoctor',
      component: () =>
        import('@/views/zy-page/statistics/ToDayRegisteDoctor.vue'),
      name: 'reconciliation_ToDayRegisteDoctor',
      meta: {
        title: '当日挂号记录',
        roles: ['ZY_ORG_ACCOUNT_RECORD_SAME_DAY'],
      },
    },
    {
      path: 'OutpatientPayment',
      component: () =>
        import('@/views/zy-page/statistics/OutpatientPayment.vue'),
      name: 'reconciliation_OutpatientPayment',
      meta: {
        title: '门诊缴费记录',
        roles: ['ZY_ORG_ACCOUNT_RECORD_OUTPATIENT_PAY'],
      },
    },
    {
      path: 'HospitalizationPayment',
      component: () =>
        import('@/views/zy-page/statistics/HospitalizationPayment.vue'),
      name: 'reconciliation_HospitalizationPayment',
      meta: {
        title: '住院缴费记录',
        roles: ['ZY_ORG_ACCOUNT_RECORD_INHOSPITAL_PAY'],
      },
    },
    {
      path: 'ReportQuery',
      component: () => import('@/views/zy-page/statistics/ReportQuery.vue'),
      name: 'reconciliation_ReportQuery',
      meta: { title: '报告查询记录', roles: ['ZY_ORG_ACCOUNT_RECORD_REPORT'] },
    },
    {
      path: 'feedback',
      component: () => import('@/views/setUp/feedback/index'),
      name: 'reconciliation_feedback',
      meta: {
        title: '意见反馈',
        roles: ['ZY_ORG_SETTING_FEEDBACK'],
      },
    },
  ],
}

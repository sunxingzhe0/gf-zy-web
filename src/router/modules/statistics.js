/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'

export default {
  path: '/statistics',
  component: Layout,
  redirect: '/statistics/order',
  name: 'StatisticsModules',
  meta: {
    title: '统计',
    icon: 'sidebar-statistics',
    roles: [
      'DRUG_STORE_STATISTICS',
      'ORG_WEB_STATISTICS',
      'DOC_WEB_STATISTICS',
      'ZY_ORG_STATISTICS',
    ], //药房端、机构端、医生端
  },
  children: [
    // {
    //   path: 'order',
    //   component: () => import('@/views/statistics/authority.vue'),
    //   name: 'Order',
    //   meta: {
    //     title: '订单统计',
    //     roles: [
    //       'DOC_WEB_STATISTICS_ORDER_STATISTICS', //医生端
    //       'DRUG_STORE_STATISTICS_ORDER_STATISTICS', //药房端
    //       'ORG_WEB_STATISTICS_ORDER_STATISTICS', //机构端
    //     ],
    //   },
    // },
    // {
    //   path: 'evaluate',
    //   component: () => import('@/views/statistics/evaluate.vue'),
    //   name: 'evaluate',
    //   meta: {
    //     title: '评价统计',
    //     roles: [
    //       'DOC_WEB_STATISTICS_EVALUATION_STATISTICS', //医生端
    //       'ORG_WEB_STATISTICS_EVALUATION_STATISTICS', // 机构端
    //     ],
    //   },
    // },
    // {
    //   path: 'Medicine',
    //   component: () => import('@/views/statistics/medicine.vue'), //药房端
    //   name: 'Medicine',
    //   meta: {
    //     title: '药品统计',
    //     roles: ['DRUG_STORE_STATISTICS_DRUG_STATISTICS'],
    //   },
    // },

    {
      path: 'order',
      component: () => import('@/views/statistics/components/OrderDoctor.vue'), //医生端
      name: 'order',
      meta: {
        title: '我的订单',
        roles: ['DOC_WEB_STATISTICS_EVALUATION_STATISTICS'],
      },
    },
    // {
    //   path:'index',
    //   component:() => import('@/views/statistics/components/index.vue'),
    //   name:'index',
    //   meta:{
    //     title:'订单',
    //   }
    // },
    {
      path: 'comment',
      component: () => import('@/views/statistics/components/Comment.vue'), //医生端
      name: 'Comment',
      meta: {
        title: '我的评价',
        roles: ['DOC_WEB_STATISTICS_ORDER_STATISTICS'], //医生端,
      },
    },
    {
      path: 'Drugorders',
      component: () => import('@/views/statistics/components/Drugorders.vue'), //药房端
      name: 'Drugorders',
      meta: {
        title: '药房药品',
        roles: ['DRUG_STORE_STATISTICS_DRUG_STATISTICS'],
      },
    },
    {
      path: 'Singleder',
      component: () => import('@/views/statistics/components/Singleder.vue'), //药房端
      name: 'Singleder',
      meta: {
        title: '药房订单',
        roles: ['DRUG_STORE_STATISTICS_ORDER_STATISTICS'],
      },
    },
    {
      path: 'mechanism',
      component: () => import('@/views/statistics/components/mechanism.vue'), //机构端
      name: 'Singleder',
      meta: {
        title: '机构订单',
        roles: ['ORG_WEB_STATISTICS_ORDER_STATISTICS'],
      },
    },
    {
      path: 'institutional',
      component: () =>
        import('@/views/statistics/components/institutional.vue'), //机构端
      name: 'Singleder',
      meta: {
        title: '所有评价',
        roles: ['ORG_WEB_STATISTICS_EVALUATION_STATISTICS'],
      },
    },
    {
      path: 'registeDoctor',
      component: () => import('@/views/zy-page/statistics/registeDoctor.vue'),
      name: 'registeDoctor',
      meta: { title: '预约挂号统计', roles: ['ZY_ORG_STATISTICS_APPOINTMENT'] },
    },
    {
      path: 'ToDayRegisteDoctor',
      component: () =>
        import('@/views/zy-page/statistics/ToDayRegisteDoctor.vue'),
      name: 'ToDayRegisteDoctor',
      meta: { title: '当日挂号统计', roles: ['ZY_ORG_STATISTICS_SAME_DAY'] },
    },
    {
      path: 'OutpatientPayment',
      component: () =>
        import('@/views/zy-page/statistics/OutpatientPayment.vue'),
      name: 'OutpatientPayment',
      meta: {
        title: '门诊缴费统计',
        roles: ['ZY_ORG_STATISTICS_OUTPATIENT_PAY'],
      },
    },
    {
      path: 'HospitalizationPayment',
      component: () =>
        import('@/views/zy-page/statistics/HospitalizationPayment.vue'),
      name: 'HospitalizationPayment',
      meta: {
        title: '住院缴费统计',
        roles: ['ZY_ORG_STATISTICS_INHOSPITAL_PAY'],
      },
    },
    {
      path: 'ReportQuery',
      component: () => import('@/views/zy-page/statistics/ReportQuery.vue'),
      name: 'ReportQuery',
      meta: { title: '报告查询统计', roles: ['ZY_ORG_STATISTICS_REPORT'] },
    },
  ],
}

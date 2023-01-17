/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
export default {
  path: '/statistics',
  component: Layout,
  redirect: '/statistics/business',
  name: 'StatisticsModules',
  meta: {
    title: '统计',
    icon: 'sidebar-statistics',
    roles: [
      'DRUG_STORE_STATISTICS',
      'ORG_WEB_STATISTICS',
      'DOC_WEB_STATISTICS',
      'ZY_ORG_STATISTICS',
      'XZ_ORG_XZ_STATISTICS',
    ], //药房端、机构端、医生端
  },
  alwaysShow: true,
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
      path: 'business',
      component: () => import('@/views/statistics/business.vue'), //机构端
      name: 'statistics_business',
      meta: {
        title: '业务统计',
        roles: ['ORG_WEB_STATISTICS_ORDER_STATISTICS'],
      },
    },
    {
      path: 'order',
      component: () => import('@/views/statistics/components/OrderDoctor.vue'), //医生端
      name: 'statistics_order',
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
      name: 'statistics_comment',
      meta: {
        title: '我的评价',
        roles: ['DOC_WEB_STATISTICS_ORDER_STATISTICS'], //医生端,
      },
    },
    {
      path: 'Drugorders',
      component: () => import('@/views/statistics/components/Drugorders.vue'), //药房端
      name: 'statistics_Drugorders',
      meta: {
        title: '药房药品',
        roles: ['DRUG_STORE_STATISTICS_DRUG_STATISTICS'],
      },
    },
    {
      path: 'Singleder',
      component: () => import('@/views/statistics/components/Singleder.vue'), //药房端
      name: 'statistics_Singleder',
      meta: {
        title: '药房订单',
        roles: ['DRUG_STORE_STATISTICS_ORDER_STATISTICS'],
      },
    },
    {
      path: 'mechanism',
      component: () => import('@/views/statistics/components/mechanism.vue'), //机构端
      name: 'statistics_mechanism',
      meta: {
        title: '机构订单',
        roles: ['ORG_WEB_STATISTICS_ORDER_STATISTICS'],
      },
    },
    {
      path: 'institutional',
      component: () =>
        import('@/views/statistics/components/institutional.vue'), //机构端
      name: 'statistics_institutional',
      meta: {
        title: '所有评价',
        roles: ['ORG_WEB_STATISTICS_EVALUATION_STATISTICS'],
      },
    },
    {
      path: 'mindStatistics',
      component: () =>
        import('@/views/statistics/components/MindStatistics.vue'),
      name: 'statistics_mindStatistics',
      meta: {
        title: '心咨统计',
        roles: ['XZ_ORG_XZ_STATISTICS_RESERVED_STATISTICS'],
      },
    },
    {
      path: 'minDistribution',
      component: () =>
        import('@/views/statistics/components/MinDistribution.vue'),
      name: 'statistics_minDistribution',
      meta: {
        title: '购买时段分布',
        roles: ['XZ_ORG_XZ_STATISTICS_RESERVED_STATISTICS'],
      },
    },
  ],
}

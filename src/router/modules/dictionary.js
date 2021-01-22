/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
export default {
  path: '/dictionary',
  component: Layout,
  redirect: '/dictionary/drugs',
  name: 'dictionary',
  alwaysShow: true,
  meta: {
    title: '字典',
    icon: 'sidebar-dictionary',
    roles: ['ORG_WEB_DICTIONARIES'],
  },
  children: [
    {
      path: 'drugs',
      component: () => import('@/views/dictionary/drugs'),
      name: 'drugs',
      meta: {
        title: '药品字典',
        roles: ['ORG_WEB_DICTIONARIES_DRUG_DICTIONARY'],
      },
    },
    {
      path: 'diagnosis',
      component: () => import('@/views/dictionary/diagnosis'),
      name: 'diagnosis',
      meta: {
        title: '诊断字典',
        roles: ['ORG_WEB_DICTIONARIES_DIAGNOSTIC_DICTIONARY'],
      },
    },
    {
      path: 'unitmanage',
      component: () => import('@/views/dictionary/unit'),
      name: 'unitManage',
      meta: { title: '单位管理', roles: ['ORG_WEB_DICTIONARIES'] },
    },
    {
      path: 'dispose',
      component: () => import('@/views/dictionary/dispose'),
      name: 'dispose',
      meta: { title: '处置字典', roles: ['ORG_WEB_DICTIONARIES'] },
    },
  ],
}

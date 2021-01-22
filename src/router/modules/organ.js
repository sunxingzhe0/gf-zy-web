/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
export default {
  path: '/organ',
  component: Layout,
  redirect: '/organ/hospita-info',
  name: 'organ',
  alwaysShow: true,
  meta: {
    title: '机构',
    icon: 'sidebar-org',
    roles: ['ORG_WEB_MECHANISM'],
  },
  children: [
    {
      path: 'hospita-info',
      component: () => import('@/views/organ/hospita-info/index'),
      name: 'hospitaInfo',
      meta: {
        title: '医院介绍',
        roles: ['ORG_WEB_MECHANISM_HOSPITAL_INTRODUCTION'],
      },
    },
    {
      path: 'department',
      component: () => import('@/views/organ/department/index'),
      name: 'department',
      meta: {
        title: '科室管理',
        roles: ['ORG_WEB_MECHANISM_DEPARTMENT_MANAGEMENT'],
      },
    },
    {
      path: 'title',
      component: () => import('@/views/organ/title/List'),
      name: 'title',
      meta: {
        title: '职称管理',
        roles: ['ORG_WEB_MECHANISM_TITLE_MANAGEMENT'],
      },
    },
    {
      path: 'pharmacy',
      component: () => import('@/views/organ/pharmacy/List'),
      name: 'pharmacy',
      meta: { title: '药房管理', roles: ['ORG_WEB_MECHANISM'] },
    },
  ],
}

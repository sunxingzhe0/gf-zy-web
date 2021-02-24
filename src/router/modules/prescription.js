/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/prescription',
  component: Layout,
  redirect: '/prescription/pending',
  name: 'PrescriptionModules',
  alwaysShow: true,
  meta: {
    title: '处方',
    icon: 'sidebar-prescriptio',
    roles: ['DRUG_DOC_PRESCRIPTION'],
  },
  children: [
    {
      path: 'pending',
      component: RouterView,
      redirect: '/prescription/pending/list',
      name: 'pending',
      meta: {
        title: '待审处方',
        roles: ['DRUG_DOC_PRESCRIPTION_PENDING_PRESCRIPTION'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/prescription/PendingList.vue'),
          props: { type: 'PENDING_REVIEW' },
          meta: {
            title: '列表',
            activeMenu: '/prescription/pending',
            keepAlive: true,
          },
          hidden: true,
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/prescription/detail'),
          meta: { title: '处方详情', activeMenu: '/prescription/pending' },
          hidden: true,
          props: true,
        },
      ],
    },
    {
      path: 'passed',
      component: RouterView,
      redirect: '/prescription/passed/list',
      name: 'passed',
      meta: {
        title: '已通过处方',
        roles: ['DRUG_DOC_PRESCRIPTION_PRESCRIPTION_APPROVED'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/prescription/List.vue'),
          props: { type: 'PASSED' },
          meta: {
            title: '列表',
            activeMenu: '/prescription/passed',
            keepAlive: true,
          },
          hidden: true,
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/prescription/detail'),
          meta: { title: '处方详情', activeMenu: '/prescription/passed' },
          hidden: true,
          props: true,
        },
      ],
    },
    {
      path: 'rejected',
      component: RouterView,
      redirect: '/prescription/rejected/list',
      name: 'rejected',
      meta: {
        title: '已驳回处方',
        roles: ['DRUG_DOC_PRESCRIPTION_PRESCRIPTION_REJECTED'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/prescription/List.vue'),
          props: { type: 'REJECTED' },
          meta: {
            title: '列表',
            activeMenu: '/prescription/rejected',
            keepAlive: true,
          },
          hidden: true,
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/prescription/detail'),
          meta: { title: '处方详情', activeMenu: '/prescription/rejected' },
          hidden: true,
          props: true,
        },
      ],
    },
  ],
}

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'

export default {
  path: '/organ',
  component: Layout,
  redirect: '/organ/hospita-info',
  name: 'organ',
  alwaysShow: true,
  meta: {
    title: '机构',
    icon: 'sidebar-org',
    roles: ['ORG_WEB_MECHANISM', 'ZY_ORG_ORG'],
  },
  children: [
    {
      path: 'hospita-info',
      component: () => import('@/views/organ/hospita-info/index'),
      name: 'organ_hospitaInfo',
      meta: {
        title: '医院介绍',
        roles: ['ORG_WEB_MECHANISM_HOSPITAL_INTRODUCTION'],
      },
    },
    {
      path: 'hosmanage',
      component: () => import('@/views/organ/hosmanage/index'),
      name: 'organ_hosmanage',
      meta: {
        title: '院区管理',
        roles: ['ZY_ORG_ORG_COURTYARD'],
      },
    },
    {
      path: 'department',
      component: RouterView,
      redirect: '/organ/department/list',
      meta: {
        title: '科室管理',
        roles: ['ORG_WEB_MECHANISM_DEPARTMENT_MANAGEMENT'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/organ/department/index'),
          hidden: true,
          meta: {
            activeMenu: '/organ/department',
          },
          name: 'organ_department',
        },
        {
          path: 'editDeptInfo',
          component: () => import('@/views/organ/department/editDeptInfo'),
          hidden: true,
          meta: {
            title: '编辑',
            activeMenu: '/organ/department',
          },
          name: 'organ_department_editDeptInfo',
        },
        {
          path: 'addDeptInfo',
          component: () => import('@/views/organ/department/editDeptInfo'),
          hidden: true,
          meta: {
            title: '新增',
            activeMenu: '/organ/department',
          },
          name: 'organ_department_addDeptInfo',
        },
      ],
    },
    {
      path: 'title',
      component: () => import('@/views/organ/title/List'),
      name: 'organ_title',
      meta: {
        title: '职称管理',
        roles: ['ORG_WEB_MECHANISM_TITLE_MANAGEMENT'],
      },
    },
    {
      path: 'organ_pharmacy',
      component: () => import('@/views/organ/pharmacy/List'),
      name: 'pharmacy',
      meta: {
        title: '药房管理',
        roles: ['ORG_WEB_MECHANISM_PHARMACY_MANAGEMENT'],
      },
    },
    {
      path: 'consul-room',
      component: () => import('@/views/organ/consul-room/index'),
      name: 'consulRoom',
      meta: {
        title: '咨询室管理',
        // roles: ['ORG_WEB_MECHANISM_PHARMACY_MANAGEMENT'],
      },
    },
  ],
}

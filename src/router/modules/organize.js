/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/organize',
  component: Layout,
  redirect: '/organize/department',
  name: 'organize',
  alwaysShow: true,
  meta: {
    title: '组织',
    icon: 'sidebar-zuzhi',
    roles: ['ZY_ORG_ORG'],
  },
  children: [
    {
      path: 'department',
      component: () => import('@/views/zy-page/organ/department/List'),
      name: 'organize_department',
      meta: { title: '科室管理', roles: ['ZY_ORG_ORG_DEPT'] },
    },
    {
      path: 'staff',
      component: RouterView,
      redirect: '/organize/staff/list',
      meta: { title: '员工管理', roles: ['ZY_ORG_ORG_EMPLOYEE'] },
      children: [
        {
          path: 'list',
          component: () => import('@/views/zy-page/organ/staff/List'),
          meta: {
            title: '列表',
            activeMenu: '/organize/staff',
            keepAlive: true,
            isBack: false,
          },
          hidden: true,
          name: 'organize_staff',
        },
        {
          path: 'add',
          component: () => import('@/views/zy-page/organ/staff/Add'),
          meta: { title: '新增员工', activeMenu: '/organize/staff' },
          hidden: true,
          name: 'organize_staff_add',
        },
        {
          path: 'edit',
          component: () => import('@/views/zy-page/organ/staff/Add'),
          meta: { title: '编辑员工', activeMenu: '/organize/staff' },
          hidden: true,
          name: 'organize_staff_edit',
        },
        {
          path: 'detail',
          component: () => import('@/views/zy-page/organ/staff/Detail'),
          meta: { title: '查看员工', activeMenu: '/organize/staff' },
          hidden: true,
          name: 'organize_staff_detail',
        },
      ],
    },
  ],
}

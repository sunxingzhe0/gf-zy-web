/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/jurisdiction',
  component: Layout,
  redirect: '/jurisdiction/account',
  name: 'jurisdiction',
  alwaysShow: true,
  meta: {
    title: '权限',
    icon: 'sidebar-jurisdiction',
    roles: ['ORG_WEB_JURISDICTION'],
  },
  children: [
    {
      path: 'account',
      component: RouterView,
      redirect: '/jurisdiction/account/list',
      meta: {
        title: '账号管理',
        roles: ['ORG_WEB_JURISDICTION_ACCOUNT_MANAGEMENT'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/jurisdiction/account/List'),
          meta: {
            title: '列表',
            activeMenu: '/jurisdiction/account',
            keepAlive: true,
            isBack: false,
          },
          name: 'jurisdiction_account',
          hidden: true,
        },
        {
          path: 'add',
          component: () =>
            import('@/views/jurisdiction/account/AddAndEdit.vue'),
          meta: { title: '新增账号', activeMenu: '/jurisdiction/account' },
          name: 'jurisdiction_account_add',
          hidden: true,
        },
        {
          path: 'edit/:id',
          component: () =>
            import('@/views/jurisdiction/account/AddAndEdit.vue'),
          props: true,
          meta: { title: '编辑帐号', activeMenu: '/jurisdiction/account' },
          name: 'jurisdiction_account_edit',
          hidden: true,
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/jurisdiction/account/Detail'),
          props: true,
          meta: { title: '查看账号', activeMenu: '/jurisdiction/account' },
          name: 'jurisdiction_account_detail',
          hidden: true,
        },
        {
          path: 'audit/:id',
          component: () => import('@/views/jurisdiction/account/Detail'),
          props: route => ({ ...route.params, audit: true }),
          meta: { title: '审核资质', activeMenu: '/jurisdiction/account' },
          name: 'jurisdiction_account_audit',
          hidden: true,
        },
      ],
    },
    {
      path: 'role',
      component: RouterView,
      redirect: '/jurisdiction/role/list',
      meta: {
        title: '角色管理',
        roles: ['ORG_WEB_JURISDICTION_ROLE_MANAGEMENT'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/jurisdiction/role/List'),
          meta: {
            title: '列表',
            activeMenu: '/jurisdiction/role',
            keepAlive: true,
            isBack: false,
          },
          name: 'jurisdiction_role',
          hidden: true,
        },
        {
          path: 'add',
          component: () => import('@/views/jurisdiction/role/AddAndEdit.vue'),
          meta: { title: '新增角色', activeMenu: '/jurisdiction/role' },
          name: 'jurisdiction_role_add',
          hidden: true,
        },
        {
          path: 'edit/:id',
          component: () => import('@/views/jurisdiction/role/AddAndEdit.vue'),
          props: true,
          meta: { title: '编辑角色', activeMenu: '/jurisdiction/role' },
          name: 'jurisdiction_role_edit',
          hidden: true,
        },
      ],
    },
  ],
}

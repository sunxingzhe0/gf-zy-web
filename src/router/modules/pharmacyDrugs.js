/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'

export default {
  path: '/drugs',
  component: Layout,
  redirect: '/drugs/drugsmanage',
  name: 'drugs',
  alwaysShow: true,
  meta: {
    title: '药品',
    icon: 'sidebar-drugs',
    roles: ['DRUG_STORE_DRUGS'],
  },
  children: [
    {
      path: 'drugsmanage',
      component: RouterView,
      redirect: '/drugs/drugsmanage/list',
      meta: { title: '药品管理', roles: ['DRUG_STORE_DRUGS_DRUG_MANAGEMENT'] },
      children: [
        {
          path: 'list',
          name: 'drugs_drugsmanage',
          component: () => import('@/views/pharmacy-drugs/DrugsManage.vue'),
          hidden: true,
          meta: {
            keepAlive: true,
            isBack: false,
            roles: ['DRUG_STORE_DRUGS_ORIGIN_MANAGEMENT'],
            activeMenu: '/drugs/drugsmanage',
          },
        },
        {
          path: 'AddNewDrugs',
          name: 'drugs_drugsmanage_AddNewDrugs',
          component: () => import('@/views/pharmacy-drugs/AddNewDrugs.vue'),
          hidden: true,
          meta: {
            title: '新增药品',
            // roles: ['DRUG_STORE_DRUGS_ORIGIN_MANAGEMENT'],
            activeMenu: '/drugs/drugsmanage',
          },
        },
        {
          path: 'AddNewDrugstt',
          component: () => import('@/views/pharmacy-drugs/AddNewDrugs.vue'),
          hidden: true,
          name: 'drugs_drugsmanage_AddNewDrugstt',
          meta: {
            title: '修改药品',
            // roles: ['DRUG_STORE_DRUGS_ORIGIN_MANAGEMENT'],
            activeMenu: '/drugs/drugsmanage',
          },
        },
      ],
    },
    {
      path: 'placemanage',
      name: 'drugs_placemanage',
      component: () => import('@/views/pharmacy-drugs/PlaceManage.vue'),
      meta: {
        title: '产地管理',
        // roles: ['DRUG_STORE_DRUGS_ORIGIN_MANAGEMENT'],
      },
    },
    // {
    //   path: 'companymanage',
    //   name:'drugs_companymanage',
    //   component: () => import('@/views/pharmacy-drugs/CompanyManage.vue'),
    //   meta: { title: '单位管理', roles: ['DRUG_STORE_DRUGS_UNIT_MANAGEMENT'] },
    // },
  ],
}

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/* Layout */
import Layout from '@/components/layout'

/* Router Modules */
import business from './modules/business' // 业务
import patient from './modules/patient' //患者
import mechanism from './modules/mechanism' //患者
import template from './modules/template' // 模板
import shift from './modules/shift' // 排班
// import statistics from './modules/statistics'
import setUp from './modules/set-up' // 设置
import prescription from './modules/prescription' // 处方
import message from './modules/message' // 消息
import pharmacyHome from './modules/pharmacyHome' // 首页
import pharmacyDrugs from './modules/pharmacyDrugs' // 药品
/* import pharmacyOrder from './modules/pharmacyOrder'
import pharmacySetup from './modules/pharmacySetup' */

// import home from './modules/home'
import organ from './modules/organ' // 机构

import order from './modules/order' // 订单
// import drugs from './modules/drugs'
import dictionary from './modules/dictionary' // 字典
import jurisdiction from './modules/jurisdiction' // 权限
import statistics from '@/router/modules/statistics' // 统计
// import organize from './modules/organize'
import payment from './modules/payment' // 缴费
import reconciliation from './modules/reconciliation' // 对账
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  pharmacyHome, // 首页
  prescription, // 处方
  message, // 消息
  business, // 业务
  patient, // 患者
  mechanism, //机构
  template, // 模板
  organ, // 机构
  pharmacyDrugs, // 药品
  dictionary, // 字典
  order, // 订单
  shift, // 排班
  payment, // 缴费
  reconciliation, // 对账
  statistics, // 统计
  jurisdiction, // 权限
  setUp, // 设置
  {
    path: '/',
    hidden: true,
    redirect: '/hello-world',
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]

const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router

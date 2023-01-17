import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/mindConsult',
  component: Layout,
  // redirect: '/appointment/lab',
  name: 'mindConsult',
  alwaysShow: true,
  meta: {
    title: '心咨',
    icon: 'sidebar-business',
    roles: ['XZ_ORG_XZ_WEB'],
  },
  children: [
    {
      path: 'workSchedule',
      name: 'mindConsult_workSchedule',
      component: RouterView,
      redirect: '/mindConsult/workSchedule/list',
      meta: {
        title: '工作日程',
        roles: ['XZ_ORG_XZ_WEB_MY_WORK_SCHEDULE'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/mindConsult/workSchedule/index.vue'),
          meta: {
            title: '列表',
            activeMenu: '/mindConsult/workSchedule',
          },
          name: 'mindConsult_workSchedule_list',
          hidden: true,
        },
        {
          path: 'supplement',
          component: () =>
            import('@/views/mindConsult/appointmentPatient/supplement'),
          meta: {
            title: '加号',
            activeMenu: '/mindConsult/workSchedule',
          },
          name: 'mindConsult_workSchedule_supplement',
          hidden: true,
        },
      ],
    },
    {
      path: 'leaveApproval',
      component: RouterView,
      redirect: '/mindConsult/leaveApproval/list',
      meta: {
        title: '请假审核',
        roles: ['XZ_ORG_XZ_WEB_LEAVE_APPROVAL'],
      },
      name: 'mindConsult_leaveApproval',
      children: [
        {
          path: 'list',
          component: () => import('@/views/mindConsult/leaveApproval/index'),
          meta: {
            title: '列表',
            activeMenu: '/mindConsult/leaveApproval',
          },
          name: 'list',
          hidden: true,
        },
        {
          path: 'patientDetail',
          name: 'patient_mine_mindDetail',
          component: () => import('@/views/patient/mine/MindDetail.vue'),
          props: true,
          hidden: true,
          meta: {
            title: '心咨患者详情',
            activeMenu: '/mindConsult/leaveApproval',
            keepAlive: true,
            isBack: false,
          },
        },
      ],
    },
    {
      path: 'allLeaveApproval',
      component: RouterView,
      redirect: '/mindConsult/allLeaveApproval/list',
      meta: {
        title: '全部请假审核',
        roles: ['XZ_ORG_XZ_WEB_ALL_LEAVE_APPROVAL'],
      },
      name: 'mindConsult_allLeaveApproval',
      children: [
        {
          path: 'list',
          component: () => import('@/views/mindConsult/leaveApproval/index'),
          meta: {
            title: '列表',
            activeMenu: '/mindConsult/allLeaveApproval',
          },
          name: 'list',
          hidden: true,
        },
        {
          path: 'patientDetail',
          name: 'patient_mine_mindDetail',
          component: () => import('@/views/patient/mine/MindDetail.vue'),
          props: true,
          hidden: true,
          meta: {
            title: '心咨患者详情',
            activeMenu: '/mindConsult/allLeaveApproval',
            keepAlive: true,
            isBack: false,
          },
        },
      ],
    },
    {
      path: 'myActivity',
      component: RouterView,
      redirect: '/mindConsult/myActivity/list',
      meta: {
        title: '我的团体管理',
        roles: ['XZ_ORG_XZ_WEB_MY_ACTIVITY'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/mindConsult/myActivity/list'),
          meta: {
            title: '列表',
            activeMenu: '/mindConsult/myActivity',
          },
          name: 'list',
          hidden: true,
        },
        {
          path: 'creat',
          component: () => import('@/views/mindConsult/myActivity/addAndedit'),
          meta: {
            title: '创建活动',
            activeMenu: '/mindConsult/myActivity',
          },
          name: 'creat',
          hidden: true,
        },
        {
          path: 'edit',
          component: () => import('@/views/mindConsult/myActivity/addAndedit'),
          meta: {
            title: '编辑活动',
            activeMenu: '/mindConsult/myActivity',
          },
          name: 'edit',
          hidden: true,
        },
        {
          path: 'info',
          component: () => import('@/views/mindConsult/myActivity/info'),
          meta: {
            title: '活动详情',
            activeMenu: '/mindConsult/myActivity',
          },
          name: 'info',
          hidden: true,
        },
        {
          path: 'registration',
          component: () =>
            import('@/views/mindConsult/myActivity/registration'),
          meta: {
            title: '报名名单',
            activeMenu: '/mindConsult/myActivity',
          },
          name: 'registration',
          hidden: true,
        },
      ],
    },
    {
      path: 'allActivity',
      component: RouterView,
      redirect: '/mindConsult/allActivity/list',
      meta: {
        title: '全部团体管理',
        roles: ['XZ_ORG_XZ_WEB_ALL_ACTIVITY'],
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/mindConsult/myActivity/list'),
          meta: {
            title: '列表',
            activeMenu: '/mindConsult/allActivity',
          },
          name: 'list',
          hidden: true,
        },
        {
          path: 'creat',
          component: () => import('@/views/mindConsult/myActivity/addAndedit'),
          meta: {
            title: '创建活动',
            activeMenu: '/mindConsult/allActivity',
          },
          name: 'creat',
          hidden: true,
        },
        {
          path: 'edit',
          component: () => import('@/views/mindConsult/myActivity/addAndedit'),
          meta: {
            title: '编辑活动',
            activeMenu: '/mindConsult/allActivity',
          },
          name: 'edit',
          hidden: true,
        },
        {
          path: 'info',
          component: () => import('@/views/mindConsult/myActivity/info'),
          meta: {
            title: '活动详情',
            activeMenu: '/mindConsult/allActivity',
          },
          name: 'info',
          hidden: true,
        },
        {
          path: 'registration',
          component: () =>
            import('@/views/mindConsult/myActivity/registration'),
          meta: {
            title: '报名名单',
            activeMenu: '/mindConsult/allActivity',
          },
          name: 'registration',
          hidden: true,
        },
      ],
    },
    {
      path: 'signupRecord',
      component: () => import('@/views/mindConsult/signupRecord'),
      meta: {
        title: '我的团体报名',
        roles: ['XZ_ORG_XZ_WEB_MY_SIGN'],
      },
      name: 'mindConsult_signupRecord',
    },
    {
      path: 'appointmentPatient',
      component: RouterView,
      redirect: '/mindConsult/appointmentPatient/list',
      meta: {
        title: '我的预约患者',
        roles: ['XZ_ORG_XZ_WEB_MY_RESERVED'],
      },
      name: 'mindConsult_appointmentPatient',
      children: [
        {
          path: 'list',
          component: () =>
            import('@/views/mindConsult/appointmentPatient/index'),
          meta: {
            title: '列表',
            activeMenu: '/mindConsult/appointmentPatient',
          },
          name: 'list',
          hidden: true,
        },
        {
          path: 'enterInfo',
          component: () =>
            import('@/views/mindConsult/appointmentPatient/enterInfo'),
          meta: {
            title: '录入',
            activeMenu: '/mindConsult/appointmentPatient',
          },
          name: 'enterInfo',
          hidden: true,
        },
        {
          path: 'supplement',
          component: () =>
            import('@/views/mindConsult/appointmentPatient/supplement'),
          meta: {
            title: '补录',
            activeMenu: '/mindConsult/appointmentPatient',
          },
          name: 'supplement',
          hidden: true,
        },
        {
          path: 'receptionRecord',
          component: () =>
            import('@/views/mindConsult/appointmentPatient/receptionRecord'),
          meta: {
            title: '接诊记录',
            activeMenu: '/mindConsult/appointmentPatient',
          },
          name: 'receptionRecord',
          hidden: true,
        },
      ],
    },
    {
      path: 'allAppointmentPatient',
      component: RouterView,
      redirect: '/mindConsult/allAppointmentPatient/list',
      meta: {
        title: '全部预约患者',
        roles: ['XZ_ORG_XZ_WEB_ALL_RESERVED'],
      },
      name: 'mindConsult_allAppointmentPatient',
      children: [
        {
          path: 'list',
          component: () =>
            import('@/views/mindConsult/appointmentPatient/index'),
          meta: {
            title: '列表',
            activeMenu: '/mindConsult/allAppointmentPatient',
          },
          name: 'list',
          hidden: true,
        },
        {
          path: 'enterInfo',
          component: () =>
            import('@/views/mindConsult/appointmentPatient/enterInfo'),
          meta: {
            title: '录入',
            activeMenu: '/mindConsult/allAppointmentPatient',
          },
          name: 'enterInfo',
          hidden: true,
        },
        {
          path: 'supplement',
          component: () =>
            import('@/views/mindConsult/appointmentPatient/supplement'),
          meta: {
            title: '补录',
            activeMenu: '/mindConsult/allAppointmentPatient',
          },
          name: 'supplement',
          hidden: true,
        },
        {
          path: 'receptionRecord',
          component: () =>
            import('@/views/mindConsult/appointmentPatient/receptionRecord'),
          meta: {
            title: '接诊记录',
            activeMenu: '/mindConsult/allAppointmentPatient',
          },
          name: 'receptionRecord',
          hidden: true,
        },
      ],
    },
    {
      path: 'scheduleTemplate',
      component: RouterView,
      redirect: '/mindConsult/scheduleTemplate/index',
      meta: {
        title: '心咨排班模板',
        roles: ['XZ_ORG_XZ_WEB_SCHEDULE_PLAN'],
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/mindConsult/scheduleTemplate/index'),
          meta: {
            title: '模板',
            activeMenu: '/mindConsult/scheduleTemplate',
          },
          name: 'mindConsult_scheduleTemplate_index',
          hidden: true,
        },
        {
          path: 'edit',
          component: () => import('@/views/mindConsult/scheduleTemplate/edit'),
          meta: {
            title: '编辑排班模板',
            activeMenu: '/mindConsult/scheduleTemplate',
          },
          name: 'mindConsult_scheduleTemplate_edit',
          hidden: true,
        },
        {
          path: 'preview',
          component: () =>
            import('@/views/mindConsult/scheduleTemplate/preview'),
          meta: {
            title: '预览排班表',
            activeMenu: '/mindConsult/scheduleTemplate',
          },
          name: 'mindConsult_scheduleTemplate_preview',
          hidden: true,
        },
      ],
    },
    {
      path: 'scheduleRoster',
      component: () => import('@/views/mindConsult/scheduleRoster/index'),
      meta: {
        title: '心咨排班表',
        roles: ['XZ_ORG_XZ_WEB_SCHEDULE'],
      },
      name: 'mindConsult_scheduleRoster',
    },
    {
      path: 'projectSet',
      component: () => import('@/views/mindConsult/projectSet/index'),
      meta: {
        title: '心咨项目设置',
        roles: ['XZ_ORG_XZ_WEB_XZ_ITEM'],
      },
      name: 'mindConsult_projectSet',
    },
    {
      path: 'stoppingRecord',
      component: RouterView,
      redirect: '/mindConsult/stoppingRecord/list',
      meta: {
        title: '我的停诊',
        roles: ['XZ_ORG_XZ_WEB_MY_SCHEDULE_STOP'],
      },
      name: 'mindConsult_stoppingRecord',
      children: [
        {
          path: 'list',
          component: () => import('@/views/mindConsult/stoppingRecord/index'),
          meta: {
            title: '列表',
            activeMenu: '/mindConsult/stoppingRecord',
          },
          name: 'mindConsult_stoppingRecord_list',
          hidden: true,
        },
        {
          path: 'patientDetail',
          name: 'patient_mine_mindDetail',
          component: () => import('@/views/patient/mine/MindDetail.vue'),
          props: true,
          hidden: true,
          meta: {
            title: '心咨患者详情',
            activeMenu: '/mindConsult/stoppingRecord',
            keepAlive: true,
            isBack: false,
          },
        },
      ],
    },
    {
      path: 'allStoppingRecord',
      component: RouterView,
      redirect: '/mindConsult/allStoppingRecord/list',
      meta: {
        title: '停诊记录',
        roles: ['XZ_ORG_XZ_WEB_SCHEDULE_STOP'],
      },
      name: 'mindConsult_allStoppingRecord',
      children: [
        {
          path: 'list',
          component: () => import('@/views/mindConsult/stoppingRecord/index'),
          meta: {
            title: '列表',
            activeMenu: '/mindConsult/allStoppingRecord',
          },
          name: 'mindConsult_allStoppingRecord_list',
          hidden: true,
        },
        {
          path: 'patientDetail',
          name: 'patient_mine_mindDetail',
          component: () => import('@/views/patient/mine/MindDetail.vue'),
          props: true,
          hidden: true,
          meta: {
            title: '心咨患者详情',
            activeMenu: '/mindConsult/allStoppingRecord',
            keepAlive: true,
            isBack: false,
          },
        },
      ],
    },
  ],
}

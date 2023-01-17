import Layout from '@/components/layout'
export default {
  path: '/appointment',
  component: Layout,
  // redirect: '/appointment/lab',
  name: 'appointment',
  alwaysShow: true,
  meta: {
    title: '预约',
    icon: 'sidebar-business',
    roles: ['APPOINTMENT_LAB', 'APPOINTMENT_EXAMINE', 'APPOINTMENT_CURE'],
  },
  children: [
    {
      path: 'lab',
      component: () => import('@/views/appointment/lab.vue'),
      meta: {
        title: '检验',
        roles: ['APPOINTMENT_LAB'],
      },
      name: 'appointment_lab',
    },
    {
      path: 'examine',
      component: () => import('@/views/appointment/examine.vue'),
      meta: {
        title: '检查',
        roles: ['APPOINTMENT_EXAMINE'],
      },
      name: 'appointment_examine',
    },
    {
      path: 'cure',
      component: () => import('@/views/appointment/cure.vue'),
      meta: {
        title: '治疗',
        roles: ['APPOINTMENT_CURE'],
      },
      name: 'appointment_cure',
    },
    // {
    //   path: 'bad',
    //   component: () => import('@/views/appointment/bed.vue'),
    //   meta: {
    //     title: '床位',
    //     //  roles: ['APPOINTMENT_BAD']
    //   },
    //   name: 'appointment_bad',
    // },
  ],
}

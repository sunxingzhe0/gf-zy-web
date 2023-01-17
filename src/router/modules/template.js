/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'

export default {
  path: '/template',
  component: Layout,
  redirect: '/template/rejectReasons',
  name: 'TemplateModules',
  alwaysShow: true,
  meta: {
    title: '模板',
    icon: 'sidebar-template',
    roles: ['DOC_WEB_TEMPLATE', 'DRUG_DOC'],
  },
  children: [
    {
      path: 'common-words',
      name: 'template_commonWords',
      component: () => import('@/views/template/CommonWords.vue'),
      meta: { title: '常用语模板', roles: ['DOC_WEB_TEMPLATE_IDIOM_TEMPLATE'] },
    },
    {
      path: 'prescription',
      name: 'template_prescription',
      component: () => import('@/views/template/Prescription.vue'),
      meta: {
        title: '处方模板',
        roles: ['DOC_WEB_TEMPLATE_PRESCRIPTION_TEMPLATE'],
      },
    },
    {
      path: 'medical-record',
      name: 'template_medicalRecord',
      component: () => import('@/views/template/MedicalRecord.vue'),
      meta: {
        title: '病历模板',
        roles: ['DOC_WEB_TEMPLATE_MEDICAL_RECORD_TEMPLATE'],
      },
    },
    /*   {
      path: 'diagnosis',
      name:'template_diagnosis',
      component: () => import('@/views/template/Diagnosis.vue'),
      meta: {
        title: '诊断模板',
        roles: ['DOC_WEB_TEMPLATE_MEDICAL_RECORD_TEMPLATE'],
      },
    }, */
    {
      path: 'rejectReasons',
      name: 'template_rejectReasons',
      component: () => import('@/views/template/rejectReasons/list'),
      meta: { title: '驳回原因', roles: ['DRUG_DOC'] },
    },
  ],
}

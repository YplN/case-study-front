import { createRouter, createWebHistory } from 'vue-router'

import ListView from '@/views/ListView.vue'
import SurveyView from '@/views/SurveyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/surveys'
    },
    {
      path: '/surveys',
      name: 'surveys',
      props: true,
      component: ListView
    },
    {
      path: '/surveys/:id',
      name: 'survey',
      props: true,
      component: SurveyView
    },
    { path: '/:pathMatch(.*)*', redirect: '/surveys' },
    { path: '/:pathMatch(.*)', redirect: '/surveys' }
  ]
})

export default router

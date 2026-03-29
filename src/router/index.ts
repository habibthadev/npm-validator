import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ValidatorView from '@/views/ValidatorView.vue';
import LevenshteinView from '@/views/LevenshteinView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/validator',
      name: 'validator',
      component: ValidatorView
    },
    {
      path: '/algorithm',
      name: 'algorithm',
      component: LevenshteinView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
});

export default router;

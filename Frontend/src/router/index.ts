import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import StoreView from '@/views/StoreView.vue';
import ShoppingCart from '@/views/ShoppingCart.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
    {
      path: '/store',
      name: 'store',
      component: StoreView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: ShoppingCart,
    },
  ],
})

export default router

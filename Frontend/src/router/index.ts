import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import StoreView from '@/views/StoreView.vue';
import UserCenterView from "@/views/UserCenterView.vue";
import ListItemView from "@/views/ListItemView.vue";
import ItemView from '@/views/ItemView.vue';
import CheckoutView from "@/views/CheckoutView.vue";

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
      path: '/userCenter',
      name: 'userCenter',
      component: UserCenterView,
    },
    {
      path: '/listItem',
      name: 'listItem',
      component: ListItemView,
    },
    {
      path: '/item/:ID',
      name: 'item',
      component: ItemView,
      props: true
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    }
  ],
})

export default router

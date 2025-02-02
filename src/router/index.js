import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../components/LoginComponent.vue'
import SignupComponent from '../components/SignupComponent.vue'
import LandingPage from '@/pages/LandingPage.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupComponent
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
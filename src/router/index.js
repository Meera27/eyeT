import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import LoginComponent from '../components/LoginComponent.vue'
import SignupComponent from '../components/SignupComponent.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
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
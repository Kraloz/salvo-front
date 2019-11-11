import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import Leaderboard from '../views/Leaderboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router

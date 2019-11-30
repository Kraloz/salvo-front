import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { game } from './game.module'
import { auth } from './auth.module'

export default new Vuex.Store({
  modules: {
    game,
    auth
  }
})

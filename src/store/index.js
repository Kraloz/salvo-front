import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nickName: null,
    gameViews: null,
    gpIndex: null,
    currentGame: null,
  },
  mutations: {
    SET_NICK_NAME(state, nickName) {
      state.nickName = nickName
    },
    SET_GAME_VIEWS(state, status) {
      state.gameViews = status
    },
    SET_CURRENT_GAME(state, game) {
      state.currentGame = game
    },
    SET_GP_INDEX(state, index) {
      state.gameIndex = index
    }
  },
  getters: {
    ships: ({currentGame}) => {
      return currentGame.ships
    }
  },
  actions: {
    setNickname({commit}, payload) {
      commit('SET_NICK_NAME', payload)
    },
    setGpIndex({commit}, payload) {
      commit('SET_GP_INDEX', payload)
    },
    setCurrentGame({commit}, payload) {
      commit('SET_CURRENT_GAME', payload)
    },

    async fetchGameViews({state, commit}) {
      /* defensive shield */
      if(!state.nickName) {
        return
      }
      /* **************** */
      try {
        const response = await axios.get(`/api/player/${state.nickName}/game_views`)
        commit('SET_GAME_VIEWS', response.data)
      } catch (error) {
          if (error.response) {
            // // console.log(error.response.data)
            // console.log(error.response.status)
            // console.log(error.response.headers)
          } else if (error.request) {
            // console.log(error.request)
          } else {
            // console.log('Error', error.message)
          }
          // console.log(error)
      }
    },
  }
})

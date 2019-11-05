import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    player: {
      id: null,
      nickName: null
    },
    gameViews: null,
    gpIndex: null,
    currentGame: null,
  },
  mutations: {
    SET_PLAYER(state, player) {
      state.player = player
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
    playerId: ({player}) => {
      if (player) {
        return player.id
      } else {
        return null
      }
    },
    playerNickName: ({player}) => {
      if (player) {
        return player.nickName
      } else {
        return null
      }
    },
    ships: ({currentGame}) => {
      if (currentGame) {
        return currentGame.ships
      } else {
        return null
      }
    },
    salvoes: ({currentGame}) => {
      if(currentGame) {
        return currentGame.salvoes
      } else {
        return null
      }
    }
  },
  actions: {
    setGpIndex({commit}, payload) {
      commit('SET_GP_INDEX', payload)
    },
    setCurrentGame({commit}, payload) {
      commit('SET_CURRENT_GAME', payload)
    },
    logOut({commit}) {
      commit('SET_GAME_VIEWS', null)
    },

    async login({commit}, payload) {
      try {
        const response = await axios.get(`/api/player/${payload}`)
        const player = {
          id: response.data.data.id,
          nickName: payload
        }
        commit('SET_PLAYER', player)
      }
      catch (error) {
        if (error.response) {
   //       console.error(error.response.data)
   //       console.error(error.response.status)
   //       console.error(error.response.headers)
        } else if (error.request) {
 //         console.error(error.request)
        } else {
//          console.error('Error', error.message)
        }
//        console.error(error)
      }
    },
    async fetchGameViews({state, commit}) {
      if(!state.player) {
        return
      }

      try {
        const response = await axios.get(`/api/player/${state.player.nickName}/game_views`)
        commit('SET_GAME_VIEWS', response.data)
      } catch (error) {
          if (error.response) {
//            console.error(error.response.data)
  //          console.error(error.response.status)
    //        console.error(error.response.headers)
          } else if (error.request) {
      //      console.error(error.request)
          } else {
        //    console.error('Error', error.message)
          }
        //  console.error(error)
      }
    },
  }
})

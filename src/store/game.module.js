import router from '../router/index.js'
import { ApiService } from '../services/api.service'

const state = {
  player: {
    id: '',
    username: ''
  },
  games: null,
  currentGame: null,
}

const mutations = {
  SET_PLAYER(state, player) {
    state.player = player
  },
  SET_GAMES(state, games) {
    state.games = games
  },
  SET_CURRENT_GAME(state, game) {
    state.currentGame = game
  },
  CLEAR_CURRENT_GAME(state) {
    state.currentGame = null
  }
}

const getters = {
  playerId: ({player}) => {
    if (player) {
      return player.id
    } else {
      return null
    }
  },
  username: ({player}) => {
    if (player) {
      return player.username
    } else {
      return null
    }
  },
  games: ({games}) => {
    return games
  },
  currentGame: ({currentGame}) => {
    return currentGame
  },
  currentGameId: ({currentGame}) => {
    return currentGame.id
  },
  ships: ({currentGame}) => {
    if (currentGame) {
      return currentGame.ships
    } else {
      return null
    }
  },
  salvoes: ({currentGame}) => {
    if (currentGame) {
      return currentGame.salvoes
    } else {
      return null
    }
  },
  
  gameShipsLocations: ({currentGame},) => {
    if (currentGame) {
      // eslint-disable-next-line no-unused-vars
      const locations = []
      currentGame.ships.forEach(ship => {
        locations.push(...ship.locations.flat())
      })
      
      return locations
    }
    
  },
  
  gameShotList: ({currentGame}, getters) => {
    if (currentGame) {
      const shots = []
      const enemyShots = []

      currentGame.salvoes.forEach(e => {
        if (e.player == getters.playerId) {
          shots.push(...e.locations)
        } else if (e.palyer != getters.playerId) {
          enemyShots.push(...e.locations)
        }
      })
      
      return { shots, enemyShots }
    }
  },
}
// eslint-disable-next-line no-unused-vars
const actions = {
  setCurrentGame({commit}, payload) {
    commit('SET_CURRENT_GAME', payload)
  },
  
  async fetchPlayerInfo({ commit }) {
    try {
      const response = await ApiService.get('/api/playerInfo')
      commit('SET_PLAYER', {id: response.data.id, username: response.data.nickName })
    } catch (error) {
      console.error(error)
    }
  },
  
  async fetchGames({ commit }) {
    try {
      const response = await ApiService.get('/api/games')
      commit('SET_GAMES', response.data.games)
    } catch (error) {
      console.error(error)
    }
  },
  
  async createGame({ dispatch }) {
    try {
      await ApiService.post('/api/games', {})
      dispatch('fetchGames')
    } catch (error) {
      console.error(error)
    }
  },
  
  async enrollGame({ dispatch }, payload) {
    try {
      const response = await ApiService.post(`/api/games/${payload}`);
      console.log(response)
      dispatch('fetchGames')
    } catch (error) {
      console.error(error)
    }
  },
  
  async fetchGameData({ commit }, payload) {
    commit('CLEAR_CURRENT_GAME')
    try {
      const response = await ApiService.get(`/api/games/${payload}/game_view`)
      commit('SET_CURRENT_GAME', response.data)
      router.push('/game')
      
    } catch (error) {
      console.error(error)
    }
  },
  
  async refreshGameData({ commit, getters }) {
    try {
      const response = await ApiService.get(`/api/games/${getters.currentGameId}/game_view`)
      commit('SET_CURRENT_GAME', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  
  // eslint-disable-next-line no-unused-vars
  async sendShipsLocations({ commit }, {gameId, locations}) {
    return await ApiService.post(`/api/games/${gameId}/ships`, locations)
  },
  
  // eslint-disable-next-line no-unused-vars
  async sendSalvoLocations({ commit }, {gameId, locations}) {
    return await ApiService.post(`/api/games/${gameId}/salvoes`, locations)
  },
}

export const game = {
  // namespaced: true,
  state,
  mutations,
  getters,
  actions
}
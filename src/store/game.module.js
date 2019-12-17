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

  // 1 para cada salvo
  hits: ({currentGame, player}) => {
    if (!currentGame) return undefined
    if (!currentGame.salvoes) return undefined

    const ownSalvoes = currentGame.salvoes
        .filter(salvo => salvo.player == player.id)
        .map(salvo => salvo.hits).flat()
    const enemySalvoes = currentGame.salvoes
        .filter(salvo => salvo.player != player.id)
        .map(salvo => salvo.hits).flat()

    return {myHits: ownSalvoes, enemyHits: enemySalvoes}
  },

  // todos los sinks hasta el turno del último salvo
  sinks: ({currentGame, player}, getters) => {
    if (!currentGame) return null
    if (!currentGame.salvoes.length) return null

    const myLastSalvo = (!getters.gameShotList.ownShots.length) ? [] :
      currentGame.salvoes
        .filter(salvo => salvo.player == player.id)
        .reduce((prev, current) => (prev.turn > current.turn) ? prev : current)

    const enemyLastSalvo = (!getters.gameShotList.enemyShots.length) ? [] :
     currentGame.salvoes
        .filter(salvo => salvo.player != player.id)
        .reduce((prev, current) => (prev.turn > current.turn) ? prev : current)

    return {mySinks: myLastSalvo.sinks, enemySinks: enemyLastSalvo.sinks}
  },

  gameShipsLocations: ({currentGame}) => {
    if (!currentGame) return undefined

    const locations = []
    currentGame.ships.forEach(ship => {
      locations.push(...ship.locations.flat())
    })
    return locations
  },
  
  gameShotList: ({currentGame, player}) => {
    if (!currentGame) return undefined

    const ownShots = []
    const enemyShots = []

    currentGame.salvoes.forEach(e => {
      if (e.player == player.id) {
        ownShots.push(...e.locations)
      } else if (e.palyer != player.id) {
        enemyShots.push(...e.locations)
      }
    })
    return { ownShots, enemyShots }
  },

  currentTurn: ({currentGame, player}) => {
    if (!currentGame) return null
    // if (!currentGame.salvoes.length) return null
    
    var arr = []
    var turn = 0;

    currentGame.salvoes.map(salvo => {
      if (salvo.player == player.id) {
      arr.push(salvo.turn);
      }
    })

    turn = Math.max.apply(Math, arr);
    return (turn == -Infinity) ? 1 : turn + 1
    // if (turn == -Infinity) {
    //   return 1;
    // } else {
    //   return turn + 1;
    // }
  },
  enemyTurn: ({currentGame, player}) => {
    if (!currentGame) return null
    // if (!currentGame.salvoes.length) return null

    var arr = []
    var turn = 0;

    currentGame.salvoes.map(salvo => {
      if (salvo.player != player.id) {
      arr.push(salvo.turn);
      }
    })

    turn = Math.max.apply(Math, arr);
    return (turn == -Infinity) ? 1 : turn + 1
    // if (turn == -Infinity) {
    //   return 1;
    // } else {
    //   return turn + 1;
    // }
  },
}

const actions = {
  // eslint-disable-next-line no-unused-vars
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
      await ApiService.post(`/api/games/${payload}`);
      dispatch('fetchGames')
    } catch (error) {
      console.error(error)
    }
  },
  
  async fetchGameData({ commit, dispatch }, payload) {
    commit('CLEAR_CURRENT_GAME')
    try {
      const response = await ApiService.get(`/api/games/${payload}/game_view`)
      dispatch('fixShipsAndCommit', response.data)
      // commit('SET_CURRENT_GAME', response.data)
      router.push('/game')
    } catch (error) {
      console.error(error)
    }
  },

  async refreshGameData({ dispatch, state }) {
    try {
      const response = await ApiService.get(`/api/games/${state.currentGame.id}/game_view`)
      dispatch('fixShipsAndCommit', response.data)
    } catch (error) {
      console.error(error)
    }
  },

  fixShipsAndCommit({ commit }, payload) {
    if(!payload.locations) {
      commit('SET_CURRENT_GAME', payload)
      return
    }
    

    if(payload.locations.reduce((prev,next) => prev[0]==next[0])) {
      payload.locations.sort()
      commit('SET_CURRENT_GAME', payload)
    } else {
      const lococations = payload.locations.map(location =>{
        const [y, ...x] = location
        return [y, x]
      })
      /// hay que hacer un join por acá
      console.log('lococations',lococations)
      commit('SET_CURRENT_GAME', payload)
    }
},

  // eslint-disable-next-line no-unused-vars
  async sendShipsLocations({ state }, {gameId, locations}) {
    return await ApiService.post(`/api/games/${state.currentGame.id}/ships`, locations)
  },
  
  // eslint-disable-next-line no-unused-vars
  async sendSalvoLocations({ state }, {gameId, shots, turn}) {
    return await ApiService.post(`/api/games/${state.currentGame.id}/salvoes`, {shots, turn})
  },
}

export const game = {
  // namespaced: true,
  state,
  mutations,
  getters,
  actions
}
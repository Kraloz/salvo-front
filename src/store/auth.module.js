import { UserService, AuthenticationError } from '../services/user.service'
import { TokenService } from '../services/storage.service'

const state = {
  authenticating: false,
  accessToken: TokenService.getToken(),
  authenticationErrorCode: 0,
  authenticationError: '',
  registering: false,
  registerErrorCode: 0,
  registerError: '',
}


const mutations = {
  LOGIN_REQUEST(state) {
    state.authenticating = true;
    state.authenticationError = ''
    state.authenticationErrorCode = 0
  },
  
  LOGIN_SUCCESS(state, accessToken) {
    state.accessToken = accessToken
    state.authenticating = false;
  },
  
  LOGIN_ERROR(state, {errorCode, errorMessage}) {
    state.authenticating = false
    state.authenticationErrorCode = errorCode
    state.authenticationError = errorMessage
  },
  
  LOGOUT_SUCCESS(state) {
    state.accessToken = ''
  },

  REGISTER_ERROR(state, {errorCode, errorsObj}) {
    state.registerErrorCode = errorCode
    state.registerError = errorsObj
  },

  REGISTERING_STATE(state, value) {
    state.registering = value
  },

  REGISTER_CLEAN_ERRORS(state) {
    state.registerErrorCode = 0
    state.registerError = ''
  },

  REGISTER_CLEAN_LOGIN(state) {
    state.authenticationErrorCode = 0
    state.authenticationError = ''
  },
}

const getters = {
  loggedIn: (state) => {
    return state.accessToken ? true : false
  },
  
  authenticationErrorCode: (state) => {
    return state.authenticationErrorCode
  },
  
  authenticationError: (state) => {
    return state.authenticationError
  },
  
  authenticating: (state) => {
    return state.authenticating
  },

  registerErrorCode: (state) => {
    return state.registerErrorCode
  },
  
  registerErrors: (state) => {
    return state.registerError
  },

  registering: (state ) => {
    return state.registering
  }
}

const actions = {
  async login({ commit }, {username, password}) {
    commit('LOGIN_REQUEST');
    try {
      const response = await UserService.login(username, password);
      commit('LOGIN_SUCCESS', response.accessToken)
      commit('SET_PLAYER', {id: response.id, username: response.username}, {root: true})
      return true
    } catch (e) {
      if (e instanceof AuthenticationError) {
        commit('LOGIN_ERROR', {errorCode: e.errorCode, errorMessage: e.message})
      }
      return false
    }
  },

  registeringToggle({ commit }, value) {
    commit('REGISTERING_STATE', value)
  },

  async register({ commit, dispatch }, {email, username, password}) {
    commit('REGISTER_CLEAN_ERRORS')
  
    try {
      const response = await UserService.register(email, username, password)
      commit('REGISTER_CLEAN_LOGIN')
      dispatch('registeringToggle', false)
      return response
    } catch (e) {
      if (e instanceof AuthenticationError) {
        if (!Array.isArray(e.message)) {
          let message = {commonError: e.message}
          commit('REGISTER_ERROR', {errorCode: e.errorCode, errorsObj: message})
          throw new AuthenticationError(e.errorCode, e.message)
        } else {
          dispatch('decoupleRegisterErrors', {errorCode: e.errorCode, errors :e.message})
        }
      }
    }
  },

  decoupleRegisterErrors({ commit }, {errorCode, errors}) {
    var message = {}
    errors.forEach((error) => {
      message[error.field] = error.message
    })
    commit('REGISTER_ERROR', {errorCode: errorCode, errorsObj: message})
    throw new AuthenticationError(errorCode, message)
  },


  logout({ commit }) {
    console.log('loggin out...')
    UserService.logout()
    commit('LOGOUT_SUCCESS')
  }
}

export const auth = {
  state,
  getters,
  actions,
  mutations
}

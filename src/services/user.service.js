import { ApiService } from './api.service'
import { TokenService } from './storage.service'

class AuthenticationError extends Error {
  constructor(errorCode, message) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.errorCode = errorCode
  }
}

const UserService = {
  /**
  * Login the user and store the access token to TokenService.
  * 
  * @returns accessToken
  * @throws AuthenticationError
  **/
  async login(username, password) {
    const requestData = {
      method: 'post',
      url: '/api/auth/signin/',
      data: {
        'username': username,
        'password': password
      }
    }
    
    try {
      const response = await ApiService.customRequest(requestData)
      TokenService.saveToken(response.data.accessToken)
      ApiService.setHeader()

      return response.data.accessToken
    } catch (error) {
      throw new AuthenticationError(error.response.status, error.response.data.message)
    }
  },
  
  async register(email, username, password) {
    const requestData = {
      method: 'post',
      url: '/api/auth/signup',
      data: {
        'email': email,
        'username': username,
        'password': password
      }
    }
    
    try {
      await ApiService.customRequest(requestData)
    } catch (error) {
      let errors = {}
      // para errores de validación
      if (error.response.data.errors) {
        errors = error.response.data.errors.map(({field, defaultMessage}) => {
          return { field, message: defaultMessage }
        })
      // para otro tipo de errores
      } else if (error.response.data.message) {
        errors = error.response.data.message
      }
      
      throw new AuthenticationError(error.response.status, errors)
    }
  },
  
  /**
  * Logout the current user by removing the token from storage.
  *
  * Will also remove `Authorization Bearer <token>` header from future requests.
  **/
  logout() {
    // Remove the token and remove Authorization header from Api Service as well
    TokenService.removeToken()
    ApiService.removeHeader()
    // ApiService.unmount401Interceptor()
  }
}

export default UserService

export { UserService, AuthenticationError }

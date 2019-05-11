import axios from 'axios'
import appSettings from '../../appSettings'

const instance = axios.create({
  baseURL: appSettings.serverPath + '/api/user'
})

export default class AuthenticationApi {
  static async register(user) {
    try {
      const res = await instance.post('/register', user)
      return res.data
    } catch (e) {
      throw e
    }
  }

  static async login(credentials) {
    try {
      const res = await instance.post('/login', credentials)
      return res.data
    } catch (e) {
      throw e
    }
  }

  static async logout() {
    try {
      const res = await instance.get('/logout')
      return res.status
    } catch (e) {
      throw e
    }
  }
}

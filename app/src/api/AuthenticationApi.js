import axios from 'axios'
import { serverPath } from '../../appSettings'

const instance = axios.create({
  baseURL: serverPath + '/api/user'
})

export default class AuthenticationApi {
  static async register(user) {
    try {
      const res = await instance.post('/register', user)
      return res.data
    } catch (e) {
      throw e.response && e.response.data ? new Error(e.response.data) : e
    }
  }

  static async login(credentials) {
    let res
    try {
      res = await instance.post('/login', credentials)
      return res.data
    } catch (e) {
      throw e.response && e.response.data ? new Error(e.response.data) : e
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

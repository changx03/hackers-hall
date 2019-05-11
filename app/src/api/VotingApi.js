import axios from 'axios'
import { serverPath } from '../../appSettings'

const instance = axios.create({
  baseURL: serverPath + '/api/event/vote'
})

export default class VotingApi {
  static async vote(eventId, voteType) {
    try {
      const res = await instance.post('', {
        eventId,
        voteType
      })
      return res.data
    } catch (e) {
      throw e
    }
  }

  static async getVotingResults() {
    try {
      const res = await instance.get()
      return res.data
    } catch (e) {
      throw e
    }
  }
}

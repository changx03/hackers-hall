import axios from 'axios'
import { serverPath } from '../../appSettings'

const instance = axios.create({
  baseURL: serverPath + '/api/timeline'
})

export default class TimelineApi {
  static async getAllTimeLineItems() {
    try {
      const res = await instance.get()
      return res.data.timelineItems || []
    } catch (e) {
      console.error(e.message)
      return []
    }
  }

  static async filterTimelineItemsByDates(startDate, endDate) {
    try {
      const res = await instance.get('', {
        params: {
          startDate,
          endDate
        }
      })
      return res.data.timelineItems || []
    } catch (e) {
      console.error(e.message)
      return []
    }
  }

  static async filterTimelineItemsBySearchCriteria(searchTerms) {
    try {
      const res = await instance.get('', {
        params: {
          search: searchTerms
        }
      })
      return res.data.timelineItems || []
    } catch (e) {
      console.error(e.message)
      return []
    }
  }
}

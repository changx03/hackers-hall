import config from '../../config/config';
import { collections, InternalServerError } from '../../config/constant';

/**
 * TimelineItemSchema
 *   name: string
 *   short: string,
 *   group: string,
 *   content: string,
 *   start: Date,
 *   end: Date,
 *   timelineEvents: Array,
 *   details: [],
 *   records: {
 *       type: Number,
 *       default: 0
 *   },
 *   breachType: string,
 *   sources: Array,
 *   targets: string,
 *   affiliations: string
 */
let timelineItems

/**
 * TimelineItems Data Access Object
 */
export default class TimelineItemsDAO {
  /**
   * injectDB initialize mongo client
   * @param {MongoClient} client
   */
  static async injectDB(client) {
    if (timelineItems) {
      return
    }
    try {
      const db = client.db(config.database)
      timelineItems = await db.collection(collections.TimelineItems)
    } catch (e) {
      console.log(`Unable to establish a collection handle in moviesDAO: ${e.message}`)
    }
  }

  /**
   * getTimelineItemsByRange returns TimelineItems by date
   * @param {Date} start
   * @param {Date} end
   * @returns {Promise<timelineItems>} - An object contains an array of TimelineItems
   */
  static async getTimelineItemsByRange(start, end) {
    const query = {}
    if (start) {
      query.start = { $gte: start }
    }
    if (end) {
      query.end = { $lte: end }
    }
    let cursor
    try {
      cursor = await timelineItems.find(query)
      const timelineItemList = await cursor.toArray()
      return { timelineItems: timelineItemList }
    } catch (e) {
      console.error(`Unable to issue getTimelineItemsByRange, ${e.message}`)
      throw new InternalServerError()
    }
  }

  static async getTimelineItemsBySearch(search) {
    const query = {}
    if (typeof search === 'string') {
      query.$text = { $search: search }
    }
    let cursor
    try {
      cursor = await timelineItems.find(query)
      const timelineItemList = await cursor.toArray()
      return { timelineItems: timelineItemList }
    } catch (e) {
      console.error(`Unable to issue getTimelineItemsBySearch, ${e.message}`)
      throw new InternalServerError()
    }
  }
}

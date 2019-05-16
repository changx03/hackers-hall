import config from '../../config/config'
import { collections, InternalServerError } from '../../config/constant'
import HttpError from '../utils/HttpError'

/**
 * EventVoteSchema
 *   eventId: TimelineItems._id
 *   voterType: string
 *   voter: Users._id
 */
let eventVotes

/**
 * EventVotes Data Access Object
 */
export default class EventVotesDAO {
  /**
   * injectDB initialize mongo client
   * @param {object} client
   */
  static async injectDB(client) {
    if (eventVotes) {
      return
    }
    try {
      const db = client.db(config.database)
      eventVotes = await db.collection(collections.EventVotes)
    } catch (e) {
      console.log(`Unable to establish a collection handle in EventVotesDAO: ${e.message}`)
    }
  }

  static async getPopularVotes() {
    const voteType = 'popular'
    const pipeline = [
      { $match: { voteType: voteType } },
      { $group: { _id: '$eventId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: collections.TimelineItems,
          let: {
            id: '$_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id']
                }
              }
            }
          ],
          as: 'timelineItem'
          // TODO: we only need _id and name. Can we apply a projection?
        }
      }
    ]
    let aggregation
    try {
      aggregation = await eventVotes.aggregate(pipeline)
    } catch (e) {
      console.log(`Unable to apply aggregation on ${collections.EventVotes}, ${e.message}`)
      throw new InternalServerError()
    }
    try {
      const result = await aggregation.toArray()

      result.length > 0 && console.log(result[0])

      const popularVotes = result
        .filter(vote => vote.timelineItem)
        .map(vote => {
          const { count } = vote
          const { _id, name } = vote.timelineItem
          return {
            eventId: _id,
            name,
            count,
            voteType
          }
        })
      return { popularVotes }
    } catch (e) {
      console.error(`Unable to convert ${collections.EventVotes} cursor to array, ${e.message}`)
      throw new InternalServerError()
    }
  }

  static async vote(eventId, userId) {
    // TODO: User _id in the session should already checked at this stage
    // TODO: index ? { voter: 1, eventId: 1, voteType: 1 }
    const eventVote = {
      eventId,
      voteType: 'popular',
      voter: userId
    }
    let vote
    try {
      vote = await eventVotes.findOne(eventVote)
    } catch (e) {
      console.error(`Unable to issue findOne ${collections.EventVotes}, ${e.message}`)
      throw new InternalServerError()
    }
    if (vote) {
      throw new HttpError('A vote for this event has already been cast by this voter.', 405)
    }
    try {
      const result = await eventVotes.insertOne(eventVote)
      return result
    } catch (e) {
      console.error(`Unable to issue insertOne ${collections.EventVotes}, ${e.message}`)
      throw new InternalServerError()
    }
  }

  static async getUsersVotes(user) {
    let votes
    try {
      votes = await eventVotes
        .find({ voter: user._id }, { projection: { eventID: 1, voteType: 1 } })
        .toArray()
      return votes.map(v => ({ ...v, voter: user.username }))
    } catch (e) {
      console.error(`Unable to issue findMany ${collections.EventVotes}, ${e.message}`)
      throw new InternalServerError()
    }
  }
}

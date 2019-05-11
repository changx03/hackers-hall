import chalk from 'chalk'
import { ObjectId } from 'mongodb'
import config from '../../config/config'
import { collections, InternalServerError } from '../../config/constant'

/**
 * UserSchema
 *   firstName: string
 *   lastName: string
 *   username: string (same as email)
 *   password: string
 *   email: string
 *   created: Date
 */

let users

/**
 * Users Data Access Objects
 */
export default class UsersDAO {
  /**
   * injectDB initialize mongo client
   * @param {MongoClient} client
   */
  static async injectDB(client) {
    if (users) {
      return
    }
    try {
      const db = client.db(config.database)
      users = await db.collection(collections.Users)
    } catch (e) {
      console.error(`Unable to establish a collection handle in EventVotesDAO: ${e.message}`)
    }
  }

  static async findUser(id) {
    try {
      return await users.findOne({ _id: ObjectId(id) }, { projection: { password: 0 } })
    } catch (e) {
      console.error(`Unable to issue findUser, ${e.message}`)
      throw new InternalServerError()
    }
  }

  static async canSignUp(email) {
    try {
      const res = await users.findOne({ email }, { projection: { email: 1, _id: 0 } })
      console.log(res)
      return !res
    } catch (e) {
      console.error(`Unable to issue canSignUp, ${e.message}`)
      throw new InternalServerError()
    }
  }

  static async createUser(userInfo) {
    const { firstName, lastName, password, email } = userInfo
    const username = userInfo.username || email
    const created = userInfo.created || new Date()
    try {
      const insertCommandResult = await users.insertOne(
        { username, firstName, lastName, email, password, created },
        { projection: { password: 0 } }
      )
      const res = {
        insertedId: insertCommandResult.insertedId
      }
      console.log(chalk.yellow(JSON.stringify(res)))
      return res
    } catch (e) {
      console.error(`Unable to issue createUser, ${e.message}`)
      throw new InternalServerError()
    }
  }

  static async getUser(email, password) {
    try {
      const user = await users.findOne({ email, password }, { projection: { password: 0 } })
      if (!user) {
        return {
          authError: new Error('Invalid username or password')
        }
      } else {
        return user
      }
    } catch (e) {
      console.error(`Unable to issue getUser, ${e.message}`)
      throw new InternalServerError()
    }
  }
}

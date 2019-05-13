import chalk from 'chalk'
import { ObjectId } from 'mongodb'
import config from '../../config/config'
import { collections, InternalServerError } from '../../config/constant'
import bcrypt from 'bcrypt'

const saltRounds = 10

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
      const hash = bcrypt.hashSync(password, saltRounds)
      const insertCommandResult = await users.insertOne(
        { username, firstName, lastName, email, password: hash, created },
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

  static async checkUserAndPassword(email, password) {
    try {
      const user = await users.findOne({ email })
      const authError = new Error('Invalid username or password')
      if (!user) {
        return { authError }
      } else {
        // compare hashed password
        const result = bcrypt.compareSync(password, user.password /** hash */)
        delete user.password
        if (result) {
          return user
        } else {
          return { authError }
        }
      }
    } catch (e) {
      console.error(`Unable to issue getUser, ${e.message}`)
      throw new InternalServerError()
    }
  }
}

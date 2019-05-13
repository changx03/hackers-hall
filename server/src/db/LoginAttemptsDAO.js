import config from '../../config/config'
import { collections, InternalServerError } from '../../config/constant'

/**
 * LoginSchema
 *   email (multi-index)
 *   ip (multi-index)
 *   failedAttempts
 *   timeout (TTL index)
 *   inProgress
 */

let loginAttempts

export default class LoginAttemptsDAO {
  static async injectDB(client) {
    if (loginAttempts) {
      return
    }
    try {
      const db = client.db(config.database)
      loginAttempts = await db.collection(collections.LoginAttempt)
    } catch (e) {
      console.error(`Unable to establish a collection handle in LoginAttemptDAO: ${e.message}`)
    }
  }

  /**
   * Client can login on same IP address within 5 attempts
   * timeout is a TTL index, so the document will be deleted after certain period
   */
  static async canAuthenticate(ip, email) {
    try {
      const loginAttempt = await loginAttempts.findOne({ ip, email })
      return !loginAttempt || loginAttempt.failedAttempts < 5
    } catch (e) {
      throw new InternalServerError()
    }
  }

  /**
   * insert document to Login
   */
  static async failedLoginAttempt(ip, email) {
    try {
      await loginAttempts.updateOne(
        { ip, email },
        { $inc: { failedAttempts: 1 }, $set: { timeout: new Date() } },
        { upsert: true }
      )
    } catch (e) {
      throw new InternalServerError()
    }
  }

  /**
   * delete Document
   */
  static async successfulLoginAttempt(ip, email) {
    try {
      await loginAttempts.deleteOne({ ip, email })
    } catch (e) {
      throw new InternalServerError()
    }
  }
}

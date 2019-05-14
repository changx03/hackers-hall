import { InternalServerError } from '../../config/constant'
import UsersDAO from '../db/UsersDAO'
import chalk from 'chalk';

export default class Auth {
  static checkUser() {
    return async function(req, res, next) {
      // TODO: Insecure implementation part 1 - get user info from session
      const { userInfo = {} } = req.session
      console.log(chalk.green('[session]'), req.session)
      if (!userInfo._id) {
        next()
        return
      }

      console.log(`[auth] id from session: ${userInfo._id}`)
      try {
        const user = await UsersDAO.findUser(userInfo._id, { projection: { password: 0 } })
        req.user = user
      } catch (e) {
        next(new InternalServerError())
      } finally {
        next()
      }
    }
  }
}

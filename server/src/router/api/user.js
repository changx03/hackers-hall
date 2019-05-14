import chalk from 'chalk'
import { Router } from 'express'
import { body, validationResult } from 'express-validator/check'
import UsersDAO from '../../db/UsersDAO'
import Auth from '../../middleware/auth'
import delayResponse from '../../utils/delayResponse'
import HttpError from '../../utils/HttpError'
import LoginAttemptsDAO from '../../db/LoginAttemptsDAO'
import { InternalServerError } from '../../../config/constant';

const userRouter = Router()

// sign up
userRouter.route('/register').post(
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .custom(async value => {
        const isUserExist = await UsersDAO.isUserExist(value)
        if (isUserExist) {
          throw new Error('This email already exists.')
        }
      }),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 character long.')
  ],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 422))
    }

    const user = req.body
    const { email } = user
    console.log(chalk.yellow(`Creating New User: ${email}`))

    try {
      const commandResult = await UsersDAO.createUser(user)
      const { insertedId } = commandResult
      if (insertedId) {
        return res.status(201).json({
          user: {
            _id: insertedId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }
        })
      }
    } catch (e) {
      next(e)
    }
  }
)

// login
userRouter.route('/login').post(
  [
    body('email')
      .isEmail()
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Invalid password.')
  ],
  Auth.checkUser(),
  async (req, res, next) => {
    const clientIp = req.clientIp
    console.log('[clientIp]', clientIp)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return delayResponse(() => next(new HttpError(errors.array()[0].msg, 422)))
    }
    
    if (req.user) {
      return delayResponse(() =>
      next(new HttpError(`Already logged in as ${req.user.username}.`, 403))
      )
    }

    try {
      const { email, password } = req.body
      // adding brute-force login checking mechanism
      const canLogin = await LoginAttemptsDAO.canAuthenticate(clientIp, email)
      if (canLogin) {
        const user = await UsersDAO.checkUserAndPassword(email, password)
        if (user.authError) {
          await LoginAttemptsDAO.failedLoginAttempt(clientIp, email)
          return delayResponse(() => next(new HttpError(user.authError.message, 401)))
        }
  
        // write session
        req.session.login(user, err => {
          if (err) {
            return next(new InternalServerError())
          }
        })
        await LoginAttemptsDAO.successfulLoginAttempt(clientIp, email)
        return delayResponse(() => res.json(user))
      } else {
        return delayResponse(() => next(new HttpError('The account is temporarily locked out.', 401)))
      }
    } catch (e) {
      delayResponse(() => next(e))
    }
  }
)

// logout
userRouter.route('/logout').get(async (req, res, next) => {
  return new Promise((resolve, reject) => {
    try {
      if (req.session) {
        req.session.destroy()
        resolve(res.sendStatus(200))
      }
    } catch (e) {
      return reject(next(e))
    }
  })
})

export default userRouter

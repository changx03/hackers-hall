import chalk from 'chalk'
import { Router } from 'express'
import { body, validationResult } from 'express-validator/check'
import UsersDAO from '../../db/UsersDAO'
import Auth from '../../middleware/auth'

const userRouter = Router()

// sign up
userRouter.route('/register').post(
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .custom(async value => {
        const canSignUp = await UsersDAO.canSignUp(value)
        if (!canSignUp) {
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
      return res.status(422).send(errors.array()[0].msg)
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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(422).send(errors.array()[0].msg)
    }

    if (req.user) {
      return next(new Error(`Already logged in as ${req.user.username}.`))
    }

    const { email, password } = req.body

    try {
      const user = await UsersDAO.checkUserAndPassword(email, password)
      if (user.authError) {
        return res.status(401).send(user.authError.message)
      }

      // write session
      req.session.login(user)

      return res.json(user)
    } catch (e) {
      next(e)
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

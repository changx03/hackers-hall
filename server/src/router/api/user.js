import chalk from 'chalk'
import { Router } from 'express'
import UsersDAO from '../../db/UsersDAO'
import Auth from '../../middleware/auth'

const userRouter = Router()

// sign up
userRouter.route('/register').post(async (req, res, next) => {
  const user = req.body
  const { email, password } = user

  // check fields
  if (!email || !password) {
    next(new Error('Missing field in register page'))
    return
  }

  let canSignUp
  try {
    canSignUp = await UsersDAO.canSignUp(email)
  } catch (e) {
    next(e)
  }

  if (!canSignUp) {
    return res.status(409).send(`The email already exists.`)
  }

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
})

// login
userRouter
  .route('/login')
  .post(Auth.checkUser(), async (req, res, next) => {
    if (req.user) {
      next(new Error(`Already logged in as ${req.user.username}`))
      return
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
  })

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

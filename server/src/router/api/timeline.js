import chalk from 'chalk'
import { Router } from 'express'
import { query, validationResult } from 'express-validator/check'
import TimelineItemsDAO from '../../db/TimelineItemsDAO'
import HttpError from '../../utils/HttpError'

const timelineRouter = Router()

timelineRouter.route('*').get(
  [
    query('startDate').custom(value => {
      if (value && isNaN(new Date(value).getTime())) {
        return Promise.reject('Invalid date')
      }
      return Promise.resolve()
    }),
    query('endDate').custom(value => {
      if (value && isNaN(new Date(value).getTime())) {
        return Promise.reject('Invalid date')
      }
      return Promise.resolve()
    })
  ],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 403))
    }

    try {
      let { startDate, endDate, search } = req.query
      let results
      if (search) {
        console.log(`search: ${search}`)
        results = await TimelineItemsDAO.getTimelineItemsBySearch(search)
      } else {
        console.log(`from ${startDate} to ${endDate}`)
        startDate = startDate ? new Date(startDate) : null
        endDate = endDate ? new Date(endDate) : null
        results = await TimelineItemsDAO.getTimelineItemsByRange(startDate, endDate)
      }
        console.log(chalk.yellow(`Total timeline items: ${results.timelineItems.length}`))  
        res.json({ timelineItems: results.timelineItems })
    } catch (err) {
      next(err)
    }
  }
)

export default timelineRouter

import { Router } from 'express'
import TimelineItemsDAO from '../../db/TimelineItemsDAO'

const timelineRouter = Router()

timelineRouter.route('*').get(async (req, res, next) => {
  try {
    let { startDate, endDate } = req.query
    console.log(`from ${startDate} to ${endDate}`)
    startDate = startDate ? new Date(startDate) : null
    endDate = endDate ? new Date(endDate) : null
    const results = await TimelineItemsDAO.getTimelineItemsByRange(startDate, endDate)
    res.json({ timelineItems: results.timelineItems })
  } catch (err) {
    next(err)
  }
})

export default timelineRouter

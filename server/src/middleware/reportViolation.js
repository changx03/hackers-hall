import { Router } from 'express'

const reportViolation = new Router()

reportViolation.use('/report-violation', req => {
  if (req.body) {
    console.log('CSP Violation: ', req.body)
  } else {
    console.log('CSP Violation: No data received!')
  }
})

export default reportViolation

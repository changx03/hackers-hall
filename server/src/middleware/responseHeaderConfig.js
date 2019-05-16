import {hsts} from 'helmet'

const maxAge = 60 * 60 * 24 * 356

function responseHeaderConfig() {
  // return (req, res, next) => {
    // res.set('Strict-Transport-Security', `max-age=${maxAge}; includeSubDomains; preload`)
  //   next()
  // }
  return hsts({
    maxAge: maxAge * 1000, // in ms
    includeSubDomains: true,
    preload: true
  })
}

export default responseHeaderConfig

const crypto = require('crypto')

// How the session is built?
// 's:' + sid + '.' + hash(sid, secret)

;(function buildSession() {
  const sid = 'rpb1ybjfvDdnvQMtYEhrlp1gEAfzZmY2'
  const secret = 'uwgBOcEP0CsS'
  const hash = crypto
    .createHmac('sha256', secret)
    .update(sid)
    .digest('base64')
    .replace(/=+$/, '')
  const buildSession = encodeURIComponent('s:' + sid + '.' + hash)
  console.log(buildSession)

  const session = "s%3Arpb1ybjfvDdnvQMtYEhrlp1gEAfzZmY2.nV9CPL1mV3PAUcLdgxaSFcpLFAx7Dm8JpaZMpszcZIY"
  console.log("Equal: " + (buildSession === session))
})()

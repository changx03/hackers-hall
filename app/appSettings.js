const isServer = typeof window === 'undefined' || window.document || window.document.createComment

const serverPath = process.env.NODE_ENV === 'production' ? '.' : 'http://localhost:8080'

export {
  serverPath,
  isServer
}

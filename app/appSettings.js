const serverPath =
  process.env.NODE_ENV === 'production' ? '.' : 'http://localhost:8080'

export default {
  serverPath
}

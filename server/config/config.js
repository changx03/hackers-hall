const port = process.env.PORT || 8080
const { DB_ADMIN, DB_USER, DB_HOST, DB_PORT, NODE_ENV, DATABASE } = process.env
const dbUri = `mongodb://${encodeURI(DB_USER)}@${encodeURI(DB_HOST)}:${DB_PORT}/${DATABASE}?authSource=admin`
const isProd = NODE_ENV === 'production'
const dbUriAdmin = `mongodb://${encodeURI(DB_ADMIN)}@${encodeURI(DB_HOST)}:${DB_PORT}/${DATABASE}?authSource=admin`

export default {
  database: DATABASE,
  dbUri,
  dbUriAdmin,
  isProd,
  mode: NODE_ENV,
  port,
  hostName: process.env.HOST_NAME
}

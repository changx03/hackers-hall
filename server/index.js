const path = require('path')
// applying runtime babel transform
require('@babel/register')({
  configFile: path.resolve(__dirname, '../babel.server.config.js')
})
require('dotenv').config()

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = require('./src')

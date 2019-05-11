const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  parser: 'postcss-scss',
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    'postcss-preset-env': { browsers: ['> 1%', 'not IE <= 11'] },
    'cssnano': isProduction ? {} : false
  }
}

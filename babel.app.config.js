module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 1%', 'not IE <= 11']
        },
        useBuiltIns: 'usage',
        corejs: 3 // the core-js version used by polyfill
      }
    ]
  ],
  plugins: ['@babel/plugin-proposal-class-properties']
}

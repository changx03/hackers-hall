module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10.15.3'
        }
      }
    ]
  ],
  plugins: ['@babel/plugin-proposal-class-properties']
}

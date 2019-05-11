const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  entry: './app/index.js',
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  optimization: {
    noEmitOnErrors: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(__dirname, './babel.app.config.js')
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProduction, // disable Hot Module Replacement in production
              publicPath: (resourcePath, context) =>
                path.relative(path.dirname(resourcePath), context) + '/'
            }
          },
          { loader: 'css-loader', options: { importLoaders: 2 } },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  externals: {
    jquery: 'jQuery',
    vis: 'vis'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: ['es-us']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './app/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new CopyPlugin([
      { from: 'node_modules/toastr/build/toastr.min.css', to: 'shared' },
      { from: 'node_modules/toastr/build/toastr.min.js', to: 'shared' },
      { from: 'node_modules/jquery/dist/jquery.min.js', to: 'shared' },
      { from: 'node_modules/vis/dist/vis.min.css', to: 'shared' },
      { from: 'node_modules/vis/dist/vis.min.js', to: 'shared' },
      { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'shared' },
      { from: 'node_modules/bootstrap/dist/js/bootstrap.min.js', to: 'shared' },
      { from: 'node_modules/react-datepicker/dist/react-datepicker.min.css', to: 'shared' },
      { from: 'app/assets', to: 'assets' }
    ])
  ]
}

if (!isProduction) {
  config.devServer = {
    contentBase: [path.join(__dirname, 'dist')],
    watchContentBase: false,
    hotOnly: true,
    historyApiFallback: true, // stops route redirect 404
    port: 3030
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config

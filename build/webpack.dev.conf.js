'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const readExchange = require('../server/lib/read-mysql/read-exchange-rate')
const readChange = require('../server/lib/read-mysql/read-change-rate')
const readCloseMin = require('../server/lib/read-mysql/read-close-min')
const readCloseMax = require('../server/lib/read-mysql/read-close-max')
const readCloseAverage = require('../server/lib/read-mysql/read-close-average')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app) {
      app.get('/changeRate/*', (req, res) => {
        let params = req.params[0].split('-')
        readChange.readChangeRateLimit(params[0],params[1], function(data) {
          res.send(data)
        })
      })
      app.get('/changeRateCode/*', (req, res) => {
        let params = req.params[0]
        readChange.readChangeRateOfCode(params, function(data) {
          res.send(data)
        })
      })
      app.get('/changeRateMaxCode/*', (req, res) => {
        let params = req.params[0]
        readChange.readChangeRateMax(params, function(data) {
          res.send(data)
        })
      })
      app.get('/changeRateMinCode/*', (req, res) => {
        let params = req.params[0]
        readChange.readChangeRateMin(params, function(data) {
          res.send(data)
        })
      })
      app.get('/changeRateAvgCode/*', (req, res) => {
        let params = req.params[0]
        readChange.readChangeRateAverage(params, function(data) {
          res.send(data)
        })
      })
      app.get('/changeRateRankingCode/*', (req, res) => {
        let params = req.params[0]
        readChange.readChangeRateRanking(params, function(data) {
          res.send(data)
        })
      })
      app.get('/exchangeValueLevel', (req, res) => {
        readExchange.readExchangeRateLevel(function(data) {
          res.send(data)
        })
      })
      app.get('/exchangeRate/*', (req, res) => {
        let params = req.params[0].split('-')
        readExchange.readExchangeRateLimit(params[0],params[1], function(data) {
            res.send(data)
          })
      })
      app.get('/exchangeRateCode/*', (req, res) => {
        let params = req.params[0]
        readExchange.readExchangeRateOfCode(params, function(data) {
          res.send(data)
        })
      })
      app.get('/exchangeRateMaxCode/*', (req, res) => {
        let params = req.params[0]
        readExchange.readExchangeRateMax(params, function(data) {
          res.send(data)
        })
      })
      app.get('/exchangeRateMinCode/*', (req, res) => {
        let params = req.params[0]
        readExchange.readExchangeRateMin(params, function(data) {
          res.send(data)
        })
      })
      app.get('/exchangeRateAvgCode/*', (req, res) => {
        let params = req.params[0]
        readExchange.readExchangeRateAverage(params, function(data) {
          res.send(data)
        })
      })
      app.get('/exchangeRateRankingCode/*', (req, res) => {
        let params = req.params[0]
        readExchange.readExchangeRateRanking(params, function(data) {
          res.send(data)
        })
      })
      app.get('/closeMin/*', (req, res) => {
          let params = req.params[0].split('-')
          readCloseMin.readCloseMinLimit(params[0],params[1], function(data) {
            res.send(data)
        })
      })
      app.get('/closeMax/*', (req, res) => {
        let params = req.params[0].split('-')
        readCloseMax.readCloseMaxLimit(params[0],params[1], function(data) {
          res.send(data)
        })
      })
      app.get('/closeAverage/*', (req, res) => {
        let params = req.params[0].split('-')
        readCloseAverage.readCloseAverageLimit(params[0],params[1], function(data) {
          res.send(data)
        })
      })
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})

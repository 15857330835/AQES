/* eslint-disable */
const merge = require('webpack-merge')
// const CompressionWebpackPlugin = require("compression-webpack-plugin")
// const needGzip = process.env.NODE_ENV === 'production' //&& process.env.VUE_APP_BASE_URL !== '/falcon-controller/'
module.exports = {
  // publicPath: process.env.NODE_ENV === "production" ? "/" : "assets",
  outputDir: 'dist',
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(options =>
        merge(options, {
          limit: 10000
        })
      )
  }
  // configureWebpack: config => {
  //   if (needGzip) {
  //     const plugins = []
  //     plugins.push(
  //         new CompressionWebpackPlugin({
  //           filename: '[path].gz[query]',
  //           algorithm: 'gzip',
  //           test: /\.css$|\.ttf$|\.svg$|\.json$|\.js$/,
  //           threshold: 0, // 只有大小大于该值的资源会被处理
  //           minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
  //           deleteOriginalAssets: true// 删除原文件
  //         }),
  //     )
  //     config.plugins = [
  //         ...config.plugins,
  //         ...plugins
  //       ]
  //   }
  // }
}

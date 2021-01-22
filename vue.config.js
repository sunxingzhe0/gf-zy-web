'use strice'

const path = require('path')
const isProd = process.env.NODE_ENV === 'production'
const defaultSettings = require('./src/settings.js')
const name = defaultSettings.title || 'vue Element Admin' // page title

function resolve(dir) {
  return path.join(__dirname, dir)
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: isProd ? './' : '/',
  lintOnSave: !isProd,
  // productionSourceMap: false,
  devServer: {
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    // before: require('./mock/mock-server.js'),
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_REMOTE_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
      },
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.when(isProd, config => {
      config
        .plugin('preload')
        .tap(options => {
          options[0].fileBlacklist = options[0].fileBlacklist || []
          options[0].fileBlacklist.push(/runtime\..*\.js$/)
          return options
        })
        .end()

      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end()

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      })

      config.optimization.runtimeChunk('single')

      config
        .plugin('HtmlHook')
        .use(HtmlHook, [
          {
            version: require('./package.json').version,
            date: new Date().toLocaleDateString(),
          },
        ])
        .end()
    })
  },
}

function HtmlHook(options) {
  this.options = options || {}
}

HtmlHook.prototype.apply = function (compiler) {
  compiler.hooks.compilation.tap('HtmlHook', compilation => {
    const onBeforeEmit = (htmlPluginData, callback) => {
      htmlPluginData.html +=
        '\n<!-- ' +
        Object.entries(this.options)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' | ') +
        ' -->'
      callback(null, htmlPluginData)
    }

    // HtmlWebPackPlugin - new
    if (compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
        'HtmlHook',
        onBeforeEmit,
      )
    } else {
      const HtmlWebpackPlugin = require('html-webpack-plugin')
      if (HtmlWebpackPlugin.getHooks) {
        const hooks = HtmlWebpackPlugin.getHooks(compilation)
        const htmlPlugins = compilation.options.plugins.filter(
          plugin => plugin instanceof HtmlWebpackPlugin,
        )
        if (htmlPlugins.length === 0) {
          const message =
            "Error running html-hook, are you sure you have html-webpack-plugin before it in your webpack config's plugins?"
          throw new Error(message)
        }
        hooks.beforeEmit.tapAsync('HtmlHook', onBeforeEmit)
      } else {
        const message =
          "Error running html-hook, are you sure you have html-webpack-plugin before it in your webpack config's plugins?"
        throw new Error(message)
      }
    }
  })
}

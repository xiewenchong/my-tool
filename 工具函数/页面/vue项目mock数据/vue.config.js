const path = require('path');
const fs = require('fs');
const mocker = require('mocker-api');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const { NODE_ENV } = process.env; // 环境变量参数
// 监听变化 测试环境打包命令 这个打包NODE_ENV是development
const buildForTest = process.argv.includes('--watch') || process.argv.includes('--buildtest');

// 预渲染打包 创建spa插件
const buildForSkeleton = process.argv.includes('--skeleton');

function isDirectory(str) {
  return fs.statSync(str).isDirectory();
}

/**
 * 获取入口
 */
function getPages() {
  const prefix = 'src/pages';
  const pagePath = path.resolve(__dirname, 'src/pages');
  const pages = [];
  const pageObj = {};
  const firstPages = fs.readdirSync(pagePath);
  for (let index = 0; index < firstPages.length; index++) {
    const curPage = firstPages[index];
    if (isDirectory(path.join(pagePath, curPage))) {
      const curSubPage = fs.readdirSync(path.join(pagePath, curPage));
      pages.push(...curSubPage.map(i => `${curPage}/${i}`));
    }
  }
  pages.forEach(page => {
    const entryFile = `${prefix}/${page}/index.js`;
    if (fs.existsSync(entryFile)) {
      pageObj[page] = {
        entry: entryFile,
        template: `${prefix}/${page}/index.html`,
        filename: `${page}.html`,
        title: page,
        mode: NODE_ENV,
        base: NODE_ENV === 'production' ? 'http://m.yaochufa.com/' : false,
        chunks: ['chunk-common', 'chunk-vendors', page],
        minify: false,
        chunksSortMode: 'manual',
      };
      if (NODE_ENV === 'production') {
        pageObj[page].title = '要出发周边游';
      }
      // if (buildForTest) {
      //   // 测试环境打包 运行时才确定publicPath
      //   pageObj[page].entry = ['./scripts/runtimePublicPath.js', pageObj[page].entry];
      // }
    }
  });
  return pageObj;
}

module.exports = {
  filenameHashing: false,
  // 获取页面
  pages: getPages(),
  publicPath: NODE_ENV === 'production' && !buildForTest && !buildForSkeleton ? '//qiniu-cdn7.jinxidao.com/u-newcli  /' : '/static/u-newcli/',
  outputDir: path.resolve(__dirname, NODE_ENV === 'production' && !buildForTest && !buildForSkeleton ? '../../../ycf-qiniu/u-newcli' : '../u-newcli'),
  css: {
    extract: NODE_ENV === 'production' || buildForTest,
  },
  lintOnSave: false, //关闭eslint语法检验
  devServer: {
    port: 8080,  //指定端口号
    before(app) {
      // TODO:serve模式下的请求全是mock，可以考虑优化为可以选择代理请求的形式（需要解决登录问题）
      mocker(app, path.resolve('./scripts/mock.js'));  //script是和本文件同级
    }
  },
  configureWebpack: config => {
    const { resolve = { alias: {} }, externals = {}, optimization = {} } = config;
    const plugins = [];

    if (buildForSkeleton) {
      const psp = new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, '../u-newcli'),
        indexPath: path.join(__dirname, '../u-newcli/index/index.html'),
        routes: ['/'],
        renderer: new Renderer({
          headless: true,
          renderAfterDocumentEvent: 'render-event',
          maxConcurrentRoutes: 1,
        }),
        server: {
          port: 8086,
        },
      });
      plugins.push(psp);
    }

    if (NODE_ENV === 'production' || buildForTest) {
      externals.vue = 'Vue';
      externals.axios = 'axios';
      externals.swiper = 'Swiper';
      externals.velocity = 'velocity-animate';
      optimization.splitChunks = {
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
          },
          common: {
            name: 'chunk-common',
            minSize: 1000,
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      };
    }
    resolve.alias['@'] = path.resolve(__dirname, './src/common');
    let output = {
      chunkFilename: `js/[name].js?v=${+new Date()}`
    };

    return {
      output,
      resolve,
      plugins,
      externals,
      optimization
    };
  },
  chainWebpack: config => {
    // TODO:根据入口移除prefetch/preload插件
    // config.plugins.delete('prefetch-search');
    // config.plugins.delete('preload-search');
    config.module
      .rule('js')
      .use('thread-loader')
      .loader('thread-loader')
      .after('cache-loader');
    config.module
      .rule("images")
      .test(/\.(jpg|png|gif)$/)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 10,
        publicPath: NODE_ENV === 'production' && !buildForTest && !buildForSkeleton ? '//qiniu-cdn7.jinxidao.com/u-newcli/img' : '/static/u-newcli/img',
        outputPath: 'img',
        name: NODE_ENV === 'development' ? '' : '[name].[ext]',
      })
      .end();
    config.module
      .rule("fonts")
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 10,
        publicPath: NODE_ENV === 'production' && !buildForTest && !buildForSkeleton ? '//qiniu-cdn7.jinxidao.com/u-newcli/fonts' : '/static/u-newcli/fonts',
        outputPath: 'fonts',
        name: NODE_ENV === 'development' ? '' : '[name].[ext]',
      })
      .end();
  },
}

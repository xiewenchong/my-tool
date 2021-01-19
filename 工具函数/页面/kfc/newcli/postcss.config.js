module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 需要转换的单位
      viewportWidth: 375,
      unitPrecision: 3,
      propList: ['*'],
      viewportUnit: 'vw', // 输出单位
      selectorBlackList: ['.vp-ignore'], // 指定不转换为视窗单位的选择器
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，
      mediaQuery: false,
      // replace: true,
      // exclude: [],
      // landscape: false,
      // landscapeUnit: 'vw',
      // landscapeWidth: 568,
    },
    'postcss-write-svg': {
      utf8: false,
    },
  },
};


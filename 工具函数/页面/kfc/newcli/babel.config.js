module.exports = {
  presets: [
    '@vue/app',
    // '@vue/cli-plugin-babel/preset',
    // ['env',            //添加 babel-preset-env 配置
    //   {
    //     //各种流行的模块化规范："amd"、 "commonjs"、 "systemjs"、 "umd"
    //     //禁止转译：false
    //     'modules': false
    //   }
    // ]
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}

# m新版兼容vue开发

## Project setup（建议使用cnpm）
```
npm install / cnpm install
```

### Compiles and hot-reloads for development（开发时使用）
### URL：localhost:8080/(pages下的一级目录)/(pages下的二级目录)
```
npm run serve
```

### 打包并且To CDN，打包至ycf_qiniu（预发布以及上线时）
```
npm run build
```

### 发布测试环境（测试环境打包）
```
npm run build:test
```

### 预渲染打包（可以配合骨架屏使用，具体使用方式后续补充）
```
npm run build:skeleton
```

### HTML模板路径以及控制器路径
### 模板文件静态文件按照打包生成的静态文件引入（注意应用配置路径），另外避免受其他版本文件的影响，优先使用打包的HTML作为模板的基础上修改
模板：/protected/modules/mmm/views/newcli/（文件夹）/（模板页面文件）
控制器：/protected/modules/mmm/controllers/（控制器文件）

/**
 * 设置mock数据的入口
 */
const fs = require('fs');
const path = require('path');

const mockData = {};

/**
 * 根据url获取json文件，返回mock数据
 * @param {String} url 请求地址
 * @param {String} fileType 模拟假数据文件类型
 * @param {Number} delay 模拟接口调用时间
 */
function loadMockDataByUrl(url, fileType = 'json', delay = 1000) {
  return new Promise((resolve) => {
    //helper是和script同级，此文件在script内
    fs.readFile(path.resolve(`./helper/mock${url}.${fileType}`), (err, data) => {
      let _data = {
        message: '加载mock数据失败',
        success: false,
      };
      if (!err) {
        try {
          if (fileType == 'json') { //json文件
            _data = JSON.parse(data);
          } else if (fileType == 'js') { //js文件
            _data = eval(new Buffer(data).toString());
          } else {
            throw new Error('非法文件类型')
          }
        } catch (error) {
          _data = {
            message: 'mock数据JSON解析失败',
            success: false,
          };
        }
      }
      setTimeout(() => {
        resolve(_data);
      }, delay);
    });
  });
}

/**
 * 添加mock数据，不传dataFn时会根据url去读json文件并返回
 * @param {String} restfulUrl 请求链接，restful风格，形如'{method} /a/b/c'
 * @param {String} fileType 请求文件的后缀名
 * @param {String} fileType 请求文件的后缀名
 */
function addMockData(restfulUrl, fileType = 'json', delay = 1000) {
  if (mockData[restfulUrl]) return false;
  mockData[restfulUrl] = function (req, res) {
    //const { query, body, method } = req;
    const url = req.url.split('?')[0];
    loadMockDataByUrl(url, fileType, delay).then((_data) => res.json(_data));
  };
}

// 添加mock请求
addMockData('GET /sipapi/search/searchProduct');
addMockData('GET /sipapi/search/getProductPrice');
addMockData('GET /sipapi/search/getPackageInfo');

module.exports = mockData;

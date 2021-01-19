import axios from 'axios';
import qs from 'qs';
// var snapiUrl ='https://supply-test1.yaochufa.com'
// var userKey = 'posg7cuYw584SYG1Kz4Nf7vSCI4uEYMZrNVw6BuX0dqvd3it1JyKvo77nQe7HeRPC+9dmf3j5U45MgrnRH0/K/lu03oRTLRTSuvTkL0UEjwzYfac5vbqr1c+JenScPNVrg5SIiaw/sKBsozqxYP3zWVeznX7FcdqI+lj3CFkkvUjup/jZIpbSuM/z+0Am2th2jrUPXVN4yaeu3NXBCuvJCOIOiDAr4Inbe6roGsy/ig4NYyXzco9vCWvJUX8ANy78ZkOTFusWNpHWgLmFbFGyw=='

var userKey = window.userKey || localStorage.getItem('kfc_userKey')
localStorage.setItem('kfc_userKey',userKey)
let baseURL = process.env.NODE_ENV === "development" ? '' : snapiUrl + '/snp/'
const databus = axios.create({
  baseURL: baseURL,
  // baseURL: snapiUrl + '/snp/', //测试 、线上
  timeout: 15000,
  // withCredentials: true,
});

var list = ['/api/shenga/getStoreMenu','/api/shenga/getOrders']  //这俩要换formdata
databus.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.headers = {
        'securityKey': userKey || localStorage.getItem('kfc_userKey')
      };
      if (list.includes(config.url)) {
        config.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'securityKey': userKey || localStorage.getItem('kfc_userKey')
        }
        config.data = qs.stringify(config.data);
      }
      
    }

    // if (config.url === '/sipapi/product/getMinPrice') {
    //   config.timeout = 30000; // getMinPrice接口，超时时长设为30s
    // }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

databus.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export default databus;

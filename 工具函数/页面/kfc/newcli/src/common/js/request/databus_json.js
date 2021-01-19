import axios from 'axios';

const databus_json = axios.create({
  // baseURL: mode,
  // baseURL: 'http://192.168.13.137:9109/snp',
  timeout: 20000,
});

databus_json.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.headers = {
        'Content-Type': 'application/json',
      };
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

databus_json.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export default databus_json;

import Vue from 'vue';
import axios from 'axios';
// import qs from 'qs';
import '@/css/common.scss';
import '@/css/mixin/index.scss';
import { Toast, Lazyload } from 'vant';
import Loading from '@/components/Loading/index.js';

Vue.prototype.$axios = axios;
// Vue.prototype.$qs = qs;
Vue.use(Loading);
Vue.prototype.$toast = Toast;
Vue.use(Lazyload);
window.imgDomin = 'https://imgorder.kfc.com.cn/mwos/Version/L/'
export default Vue;

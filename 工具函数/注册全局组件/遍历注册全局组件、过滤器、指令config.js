import Vue from 'vue';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import '@/@y/style/common.scss';
import '@/@y/style/element-variables.scss';
import '@/@y/font/iconfont.css';
import '@/@y/font/iconfont';
import http from '@/@y/http';
import filters from '@/@y/filters';
import directives from '@/@y/directives';
import components from '@/@y/components';
import urls from '@/config/url.config';
import { errText } from '@/@y/util';

/**
 * 注册vue业务组件/过滤器/指令
 * @param {string} type - 要注册的vue类型
 * @param {object} sets - 要注册的组件选项，键/值对
 */
function register(type, sets) {
    Object.entries(sets).forEach(([key, value]) => {
        if (/^mixin$|^use$/.test(type)) {
            Vue[type](value);
        } else {
            Vue[type](key, value);
        }
    });
}

// 注册通用过滤器
register('filter', filters);
// 注册通用components
register('component', components);
// 注册通用directives
register('directive', directives);

Vue.use(ElementUI);
Vue.prototype.$http = http;
Vue.prototype.$urls = urls;
Vue.prototype.$errText = errText;
Vue.prototype.$loading = ElementUI.Loading.service;

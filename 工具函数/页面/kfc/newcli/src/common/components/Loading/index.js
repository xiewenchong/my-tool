/* eslint-disable no-param-reassign */
import Vue from 'vue';
import loading from './index.vue';

const LoadingConstructor = Vue.extend(loading);

const createInstance = data => {
  if (typeof data !== 'object') {
    data = {
      message: data,
    };
  }
  return new LoadingConstructor({
    el: document.createElement('div'),
    data,
  });
};

loading.install = function (_Vue) {
  const instance = createInstance();

  _Vue.prototype.$showLoading = message => {
    if (message) {
      instance.message = message;
    }
    document.body.append(instance.$el);
  };
  _Vue.prototype.$hideLoading = () => {
    if (instance.$el) {
      document.body.removeChild(instance.$el);
    }
  };
};

export default loading;

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'Element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VCharts from 'v-charts'

Vue.config.productionTip = false
Vue.prototype.$http=axios
Vue.use(VCharts)

/* eslint-disable no-new */
Vue.use(ElementUI)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

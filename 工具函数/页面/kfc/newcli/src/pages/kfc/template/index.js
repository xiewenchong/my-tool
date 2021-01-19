import Vue from '@/js/index/index';
import store from '../../../store/kfc/index.js';
import App from './index.vue';
import { addBaiduLocation } from '@/js/api/baidu_location.js'
addBaiduLocation(window)
import VueRouter from 'vue-router';

import Index from "./components/index.vue";
import Location from "./components/location.vue";
import City from "./components/city.vue";
import Product from "./components/product.vue";
import OrderList from "./components/orderList.vue";
import OrderDetail from "./components/orderDetail.vue";
import Book from "./components/book.vue";

Vue.use(VueRouter);

//获取原型对象上的replace函数
const originalReplace = VueRouter.prototype.replace
const originalPush = VueRouter.prototype.push
//修改原型对象中的replace方法
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/specifications',
      redirect: '/product',
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
    },
    {
      path: '/location',
      name: 'location',
      component: Location,
    },
    {
      path: '/city',
      name: 'city',
      component: City,
    },
    {
      path: '/product',
      name: 'product',
      component: Product,
    },
    {
      path: '/book',
      name: 'book',
      component: Book,
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: OrderList,
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: OrderDetail,
    }
  ]
});

//兼容多规格选择的时候路由返回问题，目前是点击跳转规格页的时候历史增加一条记录，但是其实还是在product页面内
router.beforeEach((to, from, next) => {
  if (from.redirectedFrom == '/specifications#skuPage') {
    store.commit('handleShowSetProducts',false)
  }

  next()
})
new Vue({
  router,
  store,
  data: {
    eventHub: new Vue() // 给data添加一个 名字为eventHub 的空vue对象,用来传输非父子组件的数据
  },
  render: h => h(App),
}).$mount('#app');

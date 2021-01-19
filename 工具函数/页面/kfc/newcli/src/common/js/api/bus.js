class Bus {
  constructor() {
      this.callbacks =  {};
  }
  on(name, fn) {
      this.callbacks[name] = this.callbacks[name] || [];
      this.callbacks[name].push(fn);
  }
  emit(name, args) {
      if (this.callbacks[name]) {
         this.callbacks[name].forEach(cb =>cb(args));
      }
  }
}

let bus = {};

bus.install = function (Vue) {
  // 将store对象的实例绑定在vue的原型上，便于直接通过this.$store访问和使用
  Vue.prototype.$bus = new Bus();
}

export default bus;
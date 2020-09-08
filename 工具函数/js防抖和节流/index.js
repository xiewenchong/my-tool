//节流
// fn是我们需要包装的事件回调, interval是时间间隔的阈值
function throttle(fn, interval) {
  // last为上一次触发回调的时间
  let last = 0

  // 将throttle处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last >= interval) {
      // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
      last = now;
      fn.apply(context, args);
    }
  }
}
// 用throttle来包装scroll的回调
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)
document.addEventListener('scroll', better_scroll)







import { debounce } from 'throttle-debounce';
// 例子： 搜索输入框监听：每次输入中断300ms就会触发搜索
created() {
  this.debounceGetRemoteData = debounce(300, () => {
    this.getRemoteData();
  });
}
onInput(value) {
  if (value) {
    this.debounceGetRemoteData();
  }
}




// 防抖：回城按b，重新回城
// 触发事件n秒后才执行，这段时间内不断重新触发的话，每次触发都会重新计时，常用得场景有表单输入实时搜索
<input id="phone" type="text"/>
复制代码// 需要触发的函数
function debounce(d){
    console.log("联想搜索phoneNumber：" + d)
}
let inp = document.querySelector("#phone");
// 输入触发的事件
function getPhone(fn,delay){
    let timer;
    // 使用闭包，保证每次使用的定时器是同一个
    return (d)=>{
        clearTimeout(timer);
        timer = setTimeout(()=>{
            fn(d);
            // 结束之后清除定时器
            clearTimeout(timer);
        },delay)
    }
}
let getPhoneDebounce = getPhone(debounce,1000);
inp.addEventListener('keyup',(e)=>{
    getPhoneDebounce(e.target.value);
})


// 8、节流：技能冷却
<button id="shot">射击</button>
复制代码function shot(){
    console.log('射击')
}
let btn = document.querySelector('#shot');
function nextShot(fn,delay){
    let timer;
    // 闭包原理同上
    return ()=>{
        // 定时器存在，无法射击
        if(timer){
            console.log('禁止射击');
        }else{  // 定时器不存在，射击，并设置定时器
            fn();
            timer = setTimeout(()=>{
                // 定时器结束，可以射击
                clearTimeout(timer);
                timer = null;
            },delay)
        }
    }
}
let start = nextShot(shot,20);
btn.addEventListener('click',()=>{
    start();
})




// 封装输入框节流指令
<input  type="text" v-model="text"  v-debounce="search">

directives: {
      debounce: {
        inserted: function (el, binding) {  //binding是一个包含很多信息的对象，包括绑定值value，表达式expression，指令名字name等
          let timer
          el.addEventListener('keyup', () => {
            if (timer) {
              clearTimeout(timer)
            }
            timer = setTimeout(() => {
              binding.value()
            }, 300)
          })
        }
      }，
methods: {
      search () {
      // 实际要进行的操作 axios.get('')之类的
        this.count++
        console.log('count is:' + this.count)
      }
    }
/**
 * 滚动列表指令(可考虑迁移到全局指令去)
 * author:linfuxiang
 *
 * 示例：
 *  directives: {
 *      scroll: ScrollList
 *  },
 *  
 *  <ul v-scroll.global="{'touch-bottom': 'bottom'}">
 *      <li class="message" v-for="item in list" :key="item.id">
 *      </li>
 *  </ul>
 *
 * 参数：
 * 
 * 表达式(v-scroll.global.horizontal)：
 *      global: 带有此表达式则在document上监听滚动
 *      horizontal: 带有此表达式则横向滚动
 *
 * 修饰符对象(v-scroll="{'touch-bottom': 'bottom'}")：
 *      'touch-bottom'： 触碰底部的回调方法，值对应实例上下文中的方法名
 *
 * 备注：
 *     1.默认滚动到底部自动触发'touch-bottom'回调方法
 *     2.局部滚动需要先设置好元素的样式(width,height,overflow...)
 */
let scrollHeight, isGlobal, isHor;
export default {
    // 指令的定义
    inserted(el, binding, vnode) {
        // console.log(binding);
        let target, screenHeight;
        isGlobal = !!binding.modifiers.global;
        isHor = !!binding.modifiers.horizontal;

        if (isGlobal && isHor) {
            console.warn('ScrollList指令警告：不允许同时监听全局滚动和横向滚动');
            return false;
        }

        // scrollHeight 为元素最大高度，screenHeight 为元素可视高度
        if (isGlobal) {
            target = document;
            screenHeight = isHor ? document.documentElement.clientWidth : document.documentElement.clientHeight;
            scrollHeight = isHor ? document.body.offsetWidth : document.body.offsetHeight;
        } else {
            target = el;
            screenHeight = isHor ? el.offsetWidth : el.offsetHeight;
            scrollHeight = isHor ? el.scrollWidth : el.scrollHeight;
        }

        let _SCROLL_TIMEOUT_ = null;
        target.addEventListener('scroll', function() {
            let scrollTop;
            if (isGlobal) {
                scrollTop = isHor ?
                    (document.documentElement.scrollLeft || document.body.scrollLeft) :
                    (document.documentElement.scrollTop || document.body.scrollTop);
            } else {
                scrollTop = isHor ? target.scrollLeft : target.scrollTop;
            }

            clearTimeout(_SCROLL_TIMEOUT_);
            _SCROLL_TIMEOUT_ = setTimeout(() => {
                // 判断是否滑到底部加载更多
                // console.log(scrollTop, scrollHeight, screenHeight)
                if (scrollTop >= scrollHeight - screenHeight) {
                    typeof vnode.context[binding.value['touch-bottom']] === 'function' &&
                        (vnode.context[binding.value['touch-bottom']]());
                }
            }, 50);
        });
    },
    componentUpdated(el) {
        if (isGlobal && isHor) {
            return false;
        }
        // 设置定时器，把获取总高度的操作放在下一帧开始的时候执行
        setTimeout(() => {
            if (isGlobal) {
                scrollHeight = isHor ? document.body.offsetWidth : document.body.offsetHeight;
            } else {
                scrollHeight = isHor ? el.scrollWidth : el.scrollHeight;
            }
        }, 0);
    },
}
//兼容ios系统overflow对z-index层级关系的影响（scroll-area是滚动区域）
setOverflow(val) {
    if(val) {
        $(".scroll-area").css("overflow-y", "hidden");
    } else {
        $(".scroll-area").css("overflow-y", "");
    }
},












// 10. 滑动穿透
// 当你想在出现遮罩的时候，锁住用户的滚动行为，你可以这么做。

// 假设HTML结构如下：

<div class="mask">
  <div class="content">我是弹框</div>
</div>
// 效果如下：


// 最简单的办法就是阻住默认行为：

document.querySelector(".mask").addEventListener("touchmove", event => {
  event.preventDefault();
});
// 如果在vue中，你可以这么写：

<div class="mask" @touchumove.prevent></div>
// 如果.content也有滚动条，那么只要阻止遮罩本身就行：

document.querySelector(".mask").addEventListener("touchmove", event => {
  if (event.target.classList.contains("mask")) event.preventDefault();
});
// 或者：

<div class="mask" @touchumove.self.prevent></div>
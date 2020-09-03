// 以上行为可以总结成这几个（每个手机以及浏览器的表现形式不一样）：长按图片保存、长按选择文字、长按链接/手机号/邮箱时呼出菜单。

// 想要禁止这些浏览器的默认行为，可以使用以下CSS：

// 禁止长按图片保存
img {
  -webkit-touch-callout: none;
  pointer-events: none; // 像微信浏览器还是无法禁止，加上这行样式即可
}

// 禁止长按选择文字
div {
  -webkit-user-select: none;
}

// 禁止长按呼出菜单
div {
  -webkit-touch-callout: none;
}




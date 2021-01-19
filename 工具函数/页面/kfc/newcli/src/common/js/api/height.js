// 文档的总高度
export function getScrollHeight() {
  let scrollHeight = 0;
  let bodyScrollHeight = 0;
  let documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight =
    bodyScrollHeight - documentScrollHeight > 0 ? bodyScrollHeight : documentScrollHeight;
  return scrollHeight;
}

// 浏览器视口的高度
export function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

// 获取滚动的高度
export function getScroll() {
  // 简单写法
  return {
    top:
      document.body.scrollTop ||
      document.documentElement.scrollTop ||
      window.pageYOffset,
    left:
      document.body.scrollLeft ||
      document.documentElement.scrollLeft ||
      window.pageXOffset,
  };
}

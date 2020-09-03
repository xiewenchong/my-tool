// 法1：
var myfontSize = 0,
    winWidth,
    rem2px,
    remRad = 6.4;

function setFontSize() {
    winWidth = document.documentElement.clientWidth || document.body.clientWidth;
    if (winWidth > remRad * 100) {
        winWidth = remRad * 100;
    }
    rem2px = function(rem) {
        return Number((rem + '').replace('rem', '')) * winWidth / remRad;
    };
    myfontSize = winWidth / remRad;
    document.getElementsByTagName('html')[0].style.fontSize = myfontSize + 'px';
}
setFontSize();
window.onresize = function() {
    setFontSize();
};




//法2： --------------------------------------------------------------------------


// 最简单的rem自适应
html {
    font-size: calc(100vw / 3.75);
}

body {
    font-size: .14rem;
}

// 法3--------------------------------------------------------------------------
function AutoResponse(width = 750) {
    const target = document.documentElement;
    target.clientWidth >= 600
        ? (target.style.fontSize = "80px")
        : (target.style.fontSize = target.clientWidth / width * 100 + "px");
}



一般的话，直接搞lib-flexible、postcss-pxtorem
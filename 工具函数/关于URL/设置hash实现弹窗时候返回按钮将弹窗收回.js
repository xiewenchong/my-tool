//首先可以在页面加载时候就加上一个hash值，然后监听hash
that.setHash('write');
//设置hash值
setHash(str) {
    if(location.hash.replace("#", "") != str) {
        location.hash = str;
    }
}
window.onhashchange = function() {
    // 预定页返回的时候如果想提醒确认退出操作
    // if(!location.hash) {
    //     that.showExitTips = true;
    //     return false;
    // }

    if(location.hash == "#write") {
        that.$refs.couponList.slideDownCouponFrame();//收回弹窗
    }
};

//向下滑动隐藏
slideDownCouponFrame() {
    this.couponFrameSlideDown = true;
    setTimeout(() => {
        this.showCouponFrame = false;
        this.setOverflow(false);                    
    }, 300);
    this.handleVisible(false);
}
//处理弹窗
handleVisible(flag) {
    if (window.location.hash.replace("#", "") != 'couponUse') {
        if (flag === true) {
            window.location.hash = 'couponUse';
        }
    } else {
        window.history.go(-1); // 收回弹窗时候hash值回到上一页面
    }

}



// //在退出提示框里，点击取消或者黑色浮层，隐藏浮层，并pushState
// pageNotJump() {
//     this.setHash('write');
//     this.hideBox();
// },
// //在退出提示框里，点击确定，离开该页面
// pageLeave() {
//     if(this.isAPP && ykzApp.back) {
//         ykzApp.back();
//     } else {
//         history.go(-1);
//     }
// },
// //隐藏弹框
// hideBox() {
//     var that = this,
//         timer = null;
//     this.showOutAnimation = true;
//     timer = setTimeout(function() {
//         clearTimeout(timer);
//         that.showOutAnimation = false;
//         that.showExitTips = false;
//     }, 200);
// },



// <!--退出提示弹框-->
// <div class="Layer-FullScreen noticeType-Bulletbox exit-tips" :class="{'show-animation':showExitTips, 'fade-out': showOutAnimation}" v-if="showExitTips" @click="pageNotJump">
//     <div class="main" @click.stop>
//         <p class="txt-p">预订信息未填写完成，<br/>请问您是否确认取消？</p>
//         <span class="btn-cancel" @click="pageNotJump">取消</span>
//         <span class="btn-confirm" @click="pageLeave">确定</span>
//     </div>
// </div>

// //退出提示弹框
// .exit-tips {
//     background-color: rgba(0, 0, 0, .5);
//     .main {
//         border-radius: 12px;
//         width: 666px;
//         text-align: center;
//         .txt-p {
//             font-size: 30px;
//             color: rgb(88, 88, 88);
//             line-height: 1.4;
//             padding: 48px 0;
//         }
//         span {
//             display: inline-block;
//             width: 50%;
//             line-height: 97px;
//             font-size: 32px;
//         }
//         .btn-cancel {
//             color: rgb(51, 51, 51);
//             _border-top-right: 1px solid rgb(228, 230, 231);
//         }
//         .btn-confirm {
//             _border-top: 1px solid rgb(228, 230, 231);
//             color: rgb(255, 113, 36);
//         }
//     }
// }


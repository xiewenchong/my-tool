// 输入框监听
phoneInput(e) {
	this.setData({
	  phone: e.detail.value
	})
}

// 发送验证码的按钮点击事件
bindButtonTap() {
    var that = this;
    this.setData({
      disabled: true,
      color:'#ccc'
    });
    var phone = this.data.phone,
        currentTime = this.data.currentTime,
        warn = null;
    if(phone == ''){
      warn = '手机号不能为空';
    } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
      warn = '手机号格式错误';
    } else {
      wx.showToast({
        title: '验证码已发送',
        duration: 1500
      });
      var interval = setInterval(function() {
        currentTime--;
        that.setData({
          text: currentTime+'s'
        });
        if (currentTime<=0) {
          clearInterval(interval);
          that.setData({
            text: '重新发送',
            currentTime: 61,
            disabled: false,
            color: '#929fff'
          });
        }
      },100);
    }
    if(warn != null){
      wx.showToast({
        title: warn,
        icon: 'none',
        duration: 1500
      });
      this.setData({
        disabled:false,
        color: '#929fff'
      });
    }
  }
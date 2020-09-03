// <!-- 拨号 -->
<a href="tel:10086">打电话给: 10086</a>

// <!-- 发送短信 -->
<a href="sms:10086">发短信给: 10086</a>

// <!-- 发送邮件 -->
<a href="mailto:839626987@qq.com">发邮件给：839626987@qq.com</a>

// <!-- 选择照片或者拍摄照片 -->
<input type="file" accept="image/*">


{/* 选择视频或者拍摄视频 * */}
<input type="file" accept="video/*">

{/* <!-- 多选 --> */}
<input type="file" multiple></input>


忽略自动识别
<!-- 忽略浏览器自动识别数字为电话号码 -->
<meta name="format-detection" content="telephone=no">

<!-- 忽略浏览器自动识别邮箱账号 -->
<meta name="format-detection" content="email=no">
当页面上的内容包含了手机号/邮箱等，会自动转换成可点击的链接😁

比如你有如下代码：

<p>13192733603</P>
但是有些浏览器会识别为手机，并且可以点击拨号😒  

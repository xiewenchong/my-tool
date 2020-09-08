<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>要出发九周年感恩回馈</title>
    <meta name="viewport" content="width=320.1, initial-scale=0.5, maximum-scale=1, minimum-scale=1, user-scalable=no" />
    <?php $this->renderPartial('/_include/cdn_expedite'); ?>
    <meta name="keywords" content=""/>
    <meta name="description" content="要出发九周年感恩回馈"/>
    <meta http-equiv='x-dns-prefetch-control' content='on'>
    <link rel="stylesheet" href="<?php echo Yii::app()->params['paramsCommon']['ycfStaticUrl']; ?>m/style/base.css?v=<?php echo $this->_static_version; ?>">
    <link rel="stylesheet" href="<?php echo Yii::app()->params['paramsCommon']['ycfStaticUrl']; ?>m/style/active/swiper-3.3.1.min.css?v=<?php echo $this->_static_version; ?>">
    <link href="/static/activity/css/reCallOldFriends.css?v=<?php echo $this->_static_version; ?>" rel="stylesheet" type="text/css">
    <link href="/static/activity/css/iosSelect.css?v=<?php echo $this->_static_version; ?>" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="<?php echo Yii::app()->params['paramsCommon']['ycfStaticUrl']; ?>js/basket.full.min.ext.js?v=201609210953"></script>
    <script>
        var webUrl = '<?php echo Yii::app()->request->getHostInfo(); ?>'; // activity域名
        var mHost = '<?php echo Yii::app()->params['m_url']['index_default']; ?>';// M版域名
        var isLogin = "<?php echo ($this->_user_info && ($this->_user_info['securityKey'])) ? 1 : 0; ?>"; // 1-是，0-否
        var token = "<?=$token; ?>"; // 数据校验凭据
        var YII_CSRF_TOKEN = "<?php echo Yii::app()->getRequest()->getCsrfToken(); ?>";
        var userCellPhone = '<?php echo $this->_user_info['cellPhone']; ?>';
        var userCellPhone2 = '<?php echo $this->_user_info['phone']; ?>';
        var userNickName = '<?php echo $this->_user_info['userName']; ?>';
        var mismatchUrl = '<?=$mismatchUrl; ?>';
    </script>
</head>
<body>
    <div id="v-app" v-cloak>
        <div class="banner-box"><img class="banner-img" src="https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/banner_bg_new.png" alt=""></div>
        <div class="content">
            <input type="hidden" value="<?php echo Yii::app()->getRequest()->getCsrfToken(); ?>" name="YII_CSRF_TOKEN" />
            <transition name="slide-fade">
                <div class="login-box box" v-if="step == 1">
                    <div class="form-title">
                        <p>登录</p>
                        <span></span>
                    </div>
                    <div class="col col1">
                        <span>手机号</span>
                        <input class="loginPhone" v-model.trim="loginPhone" type="number" name="" id="" placeholder="请输入手机号">
                    </div>
                    <div class="col col2">
                        <span>验证码</span>
                        <div class="verific-b">
                            <input class="" v-model.trim="verCode" type="text" name="" id="" placeholder="请输入短信验证码">
                            <div class="verific-btn" v-if="getVer" @click="getver()">获取验证码</div>
                            <div class="countdown" v-else>{{sendCodeLogText}}</div>
                        </div>
                    </div>
                    <div class="sumbit-btn" :class="{'active':loginActiveStatus}" @click="sumbitLogin">登录</div>
                </div>
            </transition>
            <transition name="slide-fade">
                <div class="gift-box box" v-if="step == 2">
                    <div class="header">
                        <img src="https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/gift_icon.png" alt="">
                        <div class="right">
                            <p class="nick-name">亲爱的用户{{userNickName}}</p>
                            <p class="text">您有一份回归大礼可以免费领取</p>
                        </div>
                    </div>
                    <div class="form-title">
                        <p>以下礼品，您可任意挑选一份</p>
                        <span></span>
                    </div>
                    <div class="gift-content" v-if="giftList && giftList.length > 0">
                        <div class="gift" @click="handleChoose(index,item.id)" :class="{active:rewardId == index}" v-for="(item, index) in giftList" :key="item.id">
                            <img class="gift-img" :src="item.imageUrl" alt="">
                            <span class="gift-name">{{item.name}}</span>    
                            <img class="icon" v-if="index == rewardId" src="https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/check_icon.png" alt="">
                            <div class="sircle" v-else></div>
                        </div>
                    </div>
                    <div v-else class="null-gift">暂无礼物</div>
                    <div class="sumbit-btn" :class="{'active':giftActiveStatus}" @click="sumbitSelectGift">选好了(1/3)</div>
                </div>
            </transition>
            <transition name="slide-fade">
                <div class="up-info box" v-if="step == 3">
                    <div class="form-title">
                        <p>请填写您的收货信息</p>
                        <span></span>
                    </div>
                    <div class="col">
                        <span>收货人姓名</span>
                        <input class="consigneeName" v-model.trim="consigneeName" type="text" name="" id="" placeholder="请输入姓名">
                    </div>
                    <div class="col">
                        <span>手机号</span>
                        <input class="consigneePhone" v-model.trim="consigneePhone" type="number" name="" id="" placeholder="请输入手机号">
                    </div>
                    <div class="col">
                        <span>收货地区</span>
                        <div class="verific-b" @click="selectCity">
                            <div class="city-sele" ref="citySele" :class="{noData:!consigneeCity}">{{consigneeCity ? consigneeCity:'请选择收货地区'}}</div>
                            <input class="city-input" disabled>
                            <!-- <div class="verific-btn" @click="">></div> -->
                            <img src="https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/arrow_grey_icon.png" alt="" class="arrow_grey_icon">
                        </div>
                    </div>
                    <div class="col">
                        <span>详细地址</span>
                        <input class="consigneeAddress" v-model="consigneeAddress" type="text" name="" id="" placeholder="请输入详细地址">
                    </div>
                    <div class="sumbit-btn" :class="{'active':infoActiveStatus}" @click="sumbitInfo">下一步(2/3)</div>
                </div>
            </transition>
            <transition name="slide-fade">
                <div class="exhibition box" v-if="step == 4">
                    <div class="header" v-if="userInfo.hasAdd == '0'">
                        <img src="https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/info_icon.png" alt="">
                        <div class="right">
                            <p class="nick-name">{{userInfo.rewardName}}</p>
                            <p class="text"><span>{{userInfo.userName}}</span> {{userInfo.userPhone}}</p>
                            <p class="text2">{{userInfo.address}}</p>
                        </div>
                    </div>
                    <div class="isCorpWecharCustomer" v-if="userInfo.hasAdd == '1'">
                        <img src="https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/success_icon.png" alt="">
                        <div class="text1">恭喜您，领取成功！</div>
                        <p>我们将尽快为您发货，请耐心等待</p>
                    </div>
                    <img class="caitiao" src="https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/line_img.png" alt="">
                    <div class="qrcode-box" v-if="userInfo.hasAdd == '0'">
                        <p class="row1">最后一步，添加周年礼品小助手后，发送关键词“领取礼品”，即可领取成功啦！</p>
                        <img class="qecode-img" :src="userInfo.wechatCodeUrl ? userInfo.wechatCodeUrl : defaultQRUrl" alt="">
                        <p class="row2">长按保存二维码，微信扫一扫添加</p>
                    </div>
                    <div v-if="userInfo.hasAdd == '0'" class="bottom" @click="goIndex"><span>逛逛要出发周边游</span><img src="https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/arrow_orange_icon.png" alt=""></div>
                    <div class="has-add"  v-if="userInfo.hasAdd == '1'">
                        <div class="header">
                            <img src="https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/info_icon.png" alt="">
                            <div class="right">
                                <p class="nick-name">{{userInfo.rewardName}}</p>
                                <p class="text"><span>{{userInfo.userName}}</span> {{userInfo.userPhone}}</p>
                                <p class="text2">{{userInfo.address}}</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="userInfo.hasAdd == '1'" class="hasAdd-bottom" @click="goIndex">逛逛要出发周边游</div>

                </div>
            </transition> 
        </div>
        <div class="toast-box fn-hide" v-html="toastMes">弹窗信息</div>
        <p class="loading fn-hide"></p>
        <!-- 不符合条件弹窗 -->
        <div class="mask show" @click="handleHideMask"></div>
        <div class="coupon-pop show">
            <div class="service-inner tip-pop-inner">
                <div class="service-dialog tip-dialog">
                    <span class="return-title tip-title">您不符合活动参与条件</span>
                    <p>去看看要出发的其他活动和优惠吧</p>
                    <div class="btn" @click="goIndex">确定</div>
                </div>
            </div>
            <img @click.stop="hideCouponDialog" class="close" src="https://qiniu-cdn7.jinxidao.com/activity/reCallOldFriends/close_icon.png" alt="">
        </div>
    </div>
    <?php $this->renderPartial('/_include/confirm'); ?>
    <?php $this->renderPartial('/_include/basket_base'); ?>
    <script src="https://qiniu-cdn7.jinxidao.com/dvb/frontv2/js/lib/jquery-3.3.1.min.js"></script>
    <script src="https://qiniu-cdn7.jinxidao.com/dvb/frontv2/js/lib/vue2.5.2.js"></script>
    <script type="text/javascript">
        basket.thenRequire = [{
            url: '/static/activity/js/iscroll.js',
            key: "iscroll.js"
        }];
        basket.init();
    </script>
    <script type="text/javascript" src="/static/activity/js/reCallOldFriends.js?v=<?php echo $this->_static_version; ?>"></script>
    <script type="text/javascript" src="/static/activity/js/iosSelect.js?v=<?php echo $this->_static_version; ?>"></script>
</body>
</html>
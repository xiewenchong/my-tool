<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <?php $this->renderPartial('/_include/cdn_expedite') ?>
    <title>充值中心</title>
    <meta name="description" content="充值中心-要出发周末游" />
    <meta name="keywords" content="充值中心" />
    <meta name="viewport"
        content="width=320.1, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="expires" content="0">
    <link rel="stylesheet"
        href="<?php echo Yii::app()->params['paramsCommon']['ycfTcUrl']; ?>m/style/base.css?v=<?php echo $this->_static_version; ?>">
    <link rel="stylesheet" type="text/css" href="//qiniu-cdn7.jinxidao.com/m/style/scenic/photoswipe.css">
    <link rel="stylesheet"
        href="<?php echo Yii::app()->params['paramsCommon']['ycfTcUrl']; ?>m/style/base_header.css?v=<?php echo $this->_static_version;?>">
    <link rel="stylesheet" href="/static/mmm/style/voucher/voucher.css?v=<?php echo $this->_static_version; ?>">
    <!-- <script src="/static/default/js/meta.js"></script> -->
    <!-- <script type="text/javascript">var webUrl = '<?php echo Yii::app()->request->getHostInfo() ?>';
        var staticPath = '<?php echo $this->_baseUrl ?>/static/';
        var currentScript = '<?php echo Yii::app()->request->getScriptUrl() ?>';
    </script> -->
    <script type="text/javascript">
        var webUrl = '<?php echo Yii::app()->request->getHostInfo() ?>';
        var snapiUrl = "<?php echo Yii::app()->params['mmm_api']['snapi_url']; ?>";
        var staticPath = '<?php echo $this->_baseUrl ?>/static/';
        var currentScript = '<?php echo Yii::app()->request->getScriptUrl() ?>';
        // var w_channelLinkId = "<?php echo $info->channelLinkId;?>";
        // var w_productId = "<?php echo $info->productId;?>";
        // var resortname = "<?php echo $info->ResortName; ?>";
        // var ajaxUrl = '<?php echo $href;?>';//异步获取评论url
        // var saleway_buyContent = '<?php echo isset($info->buyContent) ? preg_replace("/[\r\n]+/", '\\n', $info->buyContent) : '';?>';
        var loginKey = "<?=$loginKey??''?>";
        var userId = "<?php echo $this->_user_info['userId']; ?>";
        var userBindPhone = "<?php echo $this->_user_info['phone'];?>"
        var securityKey = "<?php echo $this->_user_info['securityKey'] ?>"
        var w_apiUrl = "<?php echo Yii::app()->params['mmm_api']['front_default']; ?>";
        var w_apiVersion = "<?php echo Yii::app()->params['mmm_api']['version']; ?>";
        var w_apiSystem = "<?php echo Yii::app()->params['mmm_api']['system']; ?>";
    </script>
    <script type="text/javascript" src="<?php echo Yii::app()->params['paramsCommon']['ycfTcUrl']; ?>m/js/zepto.min.js">
    </script>
    <script type="text/javascript" src="/static/mmm/js/ycf.js?v=<?php echo $this->_static_version; ?>"></script>
    <script crossorigin="" type="text/javascript" src="//qiniu-cdn7.jinxidao.com/js/vue-2.5.16.min.js?v=202003311817">
    </script>
</head>

<body>
    <div class="page" v-cloak id="app">
        <div class="input-box">
            <div class="input-inner">
                <input class="phone-input" type="tel" placeholder="请输入手机号" maxlength="11" v-model.trim="displayPhone"
                    @input="onInput" @blur="onBlur" @focus="onFocus" ref="input" />
                <span class="icon iconfont text-clear" v-show="phone" @click="clearPhone">
                    <img style="width:20px;height:20px;" src="https://qiniu-cdn7.jinxidao.com/m/images/icon-s-close.png"
                        alt="">
                </span>
                <span class="region">{{region}}</span>
            </div>
            <div class="contact-container" v-if="false">
                <span class="icon iconfont contact">&#xe7e7;</span>
            </div>
        </div>
        <div class="product-box">
            <div class="tabs">
                <div class="tab-head" ref="tabHead">
                    <ul class="tab-list">
                        <li v-for="(pd,index) in tabData" ref="tabItem" :key="index"
                            :class="{'tab-item': true, 'is-active': activeTab === index}"
                            @click="handleActiveChange(index, pd)">{{pd.productName}}</li>
                    </ul>
                    <div class="tab-active-bar" v-if="activeTab !== null"
                        :style="{'left':initialLeft, 'transform': barTranslateX}"></div>
                </div>
                <div class="tab-body">
                    <div class="product-item recharge" slot="recharge" v-show="spuType == 1">
                        <div class="tab-pane" v-if="rechargeProduct">
                            <!-- 这里不把skuId当成key 是因为由默认sku到取真正的产品 skuId发生变化，旧组件会销毁 重新构造新组件 小消耗较大 -->
                            <!-- <sku-item
                                v-for="(sku, skuIndex) in rechargeSku"
                                :key="skuIndex"
                                v-bind="sku"
                                :product-id="rechargeProduct.goodsId"
                                :avaliable="phoneValid && !!operatorId"
                                :selected="skuId === sku.skuId"
                                @sku-select="onSkuSelect"
                            /> -->
                            <div v-for="(sku, skuIndex) in rechargeSku" :key="skuIndex"
                                :class="['sku-item', {'is-avaliable': (phoneValid && !!operatorId) && !isSoldOut(sku.stockNum), 'is-selected': skuId === sku.skuId}]"
                                @click="handleClick(sku)">
                                <p class="amount-box">
                                    <!-- 这里换行 unit skuPrice会产生间距 避免换行 -->
                                    <span class="amount">{{skuDisplayName(sku.spec)}}</span>{{unit(sku.spec)}}
                                </p>
                                <span class="sell-price"
                                    v-show="(phoneValid && !!operatorId) && !isSoldOut(sku.stockNum) && sku.followPrice">售价{{sku.followPrice}}元</span>
                            </div>
                            <div class="sku-item is-placeholder" v-for="i in rechargeSkuPlaceholder" :key="i"></div>
                            <p v-if="phoneValid && rechargeProduct.length > rechargeSku.length" class="load-more"
                                @click="loadMoreProduct(0)">展开更多</p>
                        </div>
                        <div class="out-of-sell" v-else>
                            <ycf-image class="topup-not-avaliable" src="./img/topup-not-avaliable.png" />
                            <p class="tips">暂不支持充值</p>
                        </div>
                    </div>
                    <div class="product-item flow" slot="flow" v-show="spuType == 2">
                        <div class="tab-pane" v-if="flowProduct">
                            <!-- <sku-item
                                v-for="(sku, skuIndex) in flowSku"
                                :key="skuIndex"
                                v-bind="sku"
                                :product-id="flowProduct.goodsId"
                                :avaliable="phoneValid && !!operatorId"
                                :selected="skuId === sku.skuId"
                                @sku-select="onSkuSelect"
                            /> -->
                            <div v-for="(sku, skuIndex) in flowSku" :key="skuIndex"
                                :class="['sku-item', {'is-avaliable': (phoneValid && !!operatorId) && !isSoldOut(sku.stockNum), 'is-selected': skuId === sku.skuId}]"
                                @click="handleClick(sku)">
                                <p class="amount-box">
                                    <!-- 这里换行 unit skuPrice会产生间距 避免换行 -->
                                    <span class="amount">{{skuDisplayName(sku.spec)}}</span>{{unit(sku.spec)}}
                                </p>
                                <span class="sell-price"
                                    v-show="(phoneValid && !!operatorId) && !isSoldOut(sku.stockNum) && sku.followPrice">售价{{sku.followPrice}}元</span>
                            </div>
                            <div class="sku-item is-placeholder" v-for="i in flowSkuPlaceholder" :key="i"></div>
                            <p v-if="phoneValid && flowProduct.length > flowSku.length" class="load-more"
                                @click="loadMoreProduct(1)">展开更多</p>
                        </div>
                        <div class="out-of-sell" v-else>
                            <ycf-image class="topup-not-avaliable" src="./img/topup-not-avaliable.png" />
                            <p class="tips">暂不支持充值</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <template>
        <div class="redpacket-box" v-if="onShelf && rpHasLimit">
            <div class="info-box no-rp" v-if="!orderCanUseRp">
                <p class="consume" v-if="orderCanUseRp === null">
                    共有红包<span class="valid-amount">{{userTotalRpAmount}}</span>元，已抵扣<span class="valid-amount">{{rpTotalValidAmount}}</span>元
                </p>
                <p class="consume" v-else>使用红包抵扣</p>
                <p class="use-tips" v-if="orderCanUseRp === null">你的优惠已用完，下个月再来吧。</p>
                <p class="use-tips" v-else>每月最高可抵扣{{rpTotalValidAmount|int}}元，你还没有<span class="rp-help" @click="goRpCenter">红包</span>哦</p>
            </div>
            <div class="info-box" v-else>
                <p class="consume">
                    共有红包<span class="valid-amount">{{userTotalRpAmount}}</span>元，可抵扣<span class="valid-amount">{{skuCanUseMaxRp || orderCanUseRp}}</span>元
                    <span class="app-tag" v-if="!isApp">APP专享</span>
                </p>
                <p class="use-tips">每月最高可抵扣{{rpTotalValidAmount|int}}元，本月还可抵扣￥{{rpRemainValidAmount}}</p>
            </div>
            <div class="check-box"  @click="toggleUseRp">
                <span class="icon iconfont use-rp-checked" v-show="useRedpacket">&#xe615;</span>
                <input class="use-rp-radio"  type="checkbox" v-model="useRedpacket"/>
            </div>
        </div>
    </template> -->

        <!-- 优惠 -->
        <div class="discount_group" v-show="skuPrice && skuId && phoneValid && JF && JF.show">
            <div class="content_wrap">
                <div class="discount_group_header">
                    <div class="notice_blk"></div>
                    <span class="discount_group_label">优惠活动</span>
                    <!-- <div class="promotion-desc-entry"  @click="onShowPromotionDescPopup">
                        <img class="promotion-desc-img" src="/static/mmm/images/booking_question_mark_icon.png" alt="">
                        
                        优惠说明
                    </div> -->
                </div>

                <!-- <div class="discount_loading_bar" @click="onDiscountLoadingBarClicked">
                       正在获取优惠信息... 
                </div> -->

                <!-- <div class="discount-option-list" hidden="{{!(uiData.discountLoadingState==0 && uiData.pkgDiscountGroups.length>0)}}" >
                    <div wx:for="{{uiData.pkgDiscountGroups}}" wx:for-item="pkgDiscountGroup" wx:key="id-pkg-discount-groups" class="pkg-discount-group" >

                        <div class="discount-group-title" hidden="{{!(uiData.pkgDiscountGroups.length>1 && pkgDiscountGroup.optionStates.length>0)}}">
                            <div class="discount-group-title-blk"></div>
                            <div class="pkg-name">{{pkgDiscountGroup.pkgName}}</div>
                        </div>

                        <div wx:for="{{pkgDiscountGroup.optionStates}}" wx:key="id-pkg-discount-group-options" class="discount-option-item" style="margin-left:{{pkgDiscountGroup.optionMarginLeft}};"
                            data-group="{{pkgDiscountGroup}}"   data-item="{{item}}" bindtap="onDiscountOptionClicked">
                            <div class ="option_sp" hidden="{{!(index>0)}}"></div>
                            <div class="discount-option-bar">
                                <div class="info_wrap">
                                    <div class="title_wrap" >{{item.title}}</div>
                                    <div class="desc_wrap" >{{item.desc}}</div>
                                </div>
                                <div class="option-select-flag selected" hidden="{{!(item.selState==1)}}"><span class="iconfont icon-yixuanbaoliuyanse"></span></div>
                                <div class="option-select-flag unselected" hidden="{{!(item.selState!=1)}}"><span class="iconfont icon-weixuan" ></span></div>
                            </div>
                        </div>

                    </div>
                </div> -->
                <!--  end discount option list -->


                <!-- 积分的UI是特别的 -->
                <div class="discount-option-item jifen">
                    <!--
                    <div class ="option_sp" ></div>
                    -->
                    <div class="discount-option-bar" @click="onJiFenClicked">
                        <div class="info_wrap">
                            <div class="title_wrap">
                                <span class="title_text">红包抵现金（现有红包</span><span
                                    class="jifen_balance_text">{{JF.jiFenBalanceHB}}</span><span
                                    class="title_text">）</span>
                                <span class="jifen-rule-entry" @click="onJiFenRuleEntryClicked"> ? </span>
                            </div>
                            <!--没有选中或被禁止就显示默认描述 -->
                            <div class="desc_wrap" v-show="JF.jiFenSelState!=1">
                                <span class="desc_text">{{JF.jiFenDesc}}</span>
                                <span class="frezz-flag" v-if="!JF.jiFenActive">已冻结</span>
                            </div>
                            <!--选中显示积分抵扣状态 -->
                            <div class="desc_wrap selected" v-show="JF.jiFenSelState==1">
                                <span class="desc_text">{{JF.jiFenDescPrefix}}</span>
                                <span class="jifen_balance_text">{{JF.curJiFenApplyHB}}</span>
                                <span class="desc_text">元红包抵扣</span>
                                <span class="jifen_balance_text">{{JF.jiFenDiscountCNY}}</span>
                                <span class="desc_text">元</span>
                            </div>
                        </div>
                        <img class="option-select-flag" v-show="JF.jiFenSelState!=1"
                            src="https://qiniu-cdn7.jinxidao.com/m/images/icon-radio-bg1.png" alt="">
                        <img class="option-select-flag" v-show="JF.jiFenSelState==1"
                            src="https://qiniu-cdn7.jinxidao.com/m/images/icon-radio-bg2.png" alt="">
                        <!-- <div class="option-select-flag selected" v-if="true"><span class="iconfont icon-yixuanbaoliuyanse"></span></div> -->
                        <!-- <div class="option-select-flag unselected" v-else><span class="iconfont icon-weixuan" ></span></div> -->
                    </div>
                    <!--选中就显示积分输入栏 -->
                    <div class="jifen_apply_group" v-show="JF.jiFenSelState==1">
                        <input @input="jifenApplyInputChange" class="jifen_apply_input" data-name="jifenApply"
                            :value="JF.jifenApplyValStr" type="number" :placeholder="JF.jiFenPlaceHolder"
                            placeholder-class="placeholder" />
                        <div class="jifen_apply_btn" @click="onJiFenApply">使用</div>
                    </div>
                </div>


                <!-- <div class="login_tips" v-show="false" @click="onAccountBindingTipsClicked">
                    <div class="login_tips_text">绑定手机号查看更多优惠
                        <span class="iconfont icon-right"></span>
                    </div>
                </div> -->

            </div>
        </div>
        <!-- 积分规则弹窗 -->
        <div class="jifen-rule-popup" v-if="showJiFenRulePopup" @click="onHideJifenRulePopup">
            <div class="jifen-rule-box">
                <div class="jifen-rule-title">
                    <div>红包抵扣规则</div>
                </div>
                <div class="jifen-rule-title-sp"></div>
                <div class="jifen-rule-text">{{JF.jiFenRuleStr}}</div>

            </div>
        </div>

        <div class="pay-box" v-if="onShelf">
            <button class="pay-btn" type="button" :disabled="paymentDisable"
                @click="showConfirmDialog">{{payBtnText}}</button>
            <!-- <div class="tips-box">
                <p class="pay-tips" v-show="!paymentDisable">*充值成功后不可退款</p>
                <a class="pay-help" href="/front/topUpCenter/help"><span class="icon iconfont question">&#xe708;</span>充值帮助</a>
            </div> -->
        </div>
        <!-- loading -->
        <div class="loadingpopWrap common-font fixed-mask" v-show="loading">
            <div class="loadingpop load fixed-center">
                <p><img src="https://qiniu-cdn0.jinxidao.com/m/icons/loading.gif" alt=""></p>
            </div>
        </div>
        <div class="common-tips" id="tips" v-html="tipMessage" v-show="tip"></div>
        <!-- <ycf-dialog v-if="!isApp && rpHasLimit" :visible="showDownloadDialog">
            <p class="dialog-title" slot="title">需要下载APP</p>
            <p class="dialog-body">
                充值仅支持在APP中享用红包抵扣
                <br/>
                立即下载，立即抵扣
            </p>
            <div class="dialog-footer" slot="footer">
                <div class="dialog-btn-group" v-if="isWx">
                    <div class="giveup" @click="hideDownloadDialog">放弃优惠</div>
                    <div class="download-app" @click="goDownload">下载APP</div>
                </div>
                <div class="know-btn" v-else-if="isMp" @click="hideDownloadDialog">
                    我知道了
                </div>
            </div>
        </ycf-dialog>
        <ycf-dialog :visible="showConfirm">
            <p class="dialog-title" slot="title">提示</p>
            <p class="dialog-body">
                充值号码为 {{displayPhone}}
                <br/>
                确认继续充值吗？
            </p>
            <div class="dialog-footer" slot="footer">
                <div class="dialog-btn-group">
                    <div class="giveup" @click="hideConfirmDialog">取消</div>
                    <div class="download-app" @click="onPayClick">确认</div>
                </div>
            </div>
        </ycf-dialog> -->
        <div class="ycf-dialog__wrapper" style="" v-show="showConfirm">
            <div class="ycf-dialog">
                <div class="ycf-dialog__header">
                    <p class="dialog-title">提示</p>
                </div>
                <div class="ycf-dialog__body">
                    <p class="dialog-body">
                        充值号码为 {{phone}}
                        <br>
                        确认继续充值吗？
                    </p>
                </div>
                <div class="ycf-dialog__footer"><span class="sp-line-top"></span>
                    <div class="dialog-footer">
                        <div class="dialog-btn-group">
                            <div class="giveup" @click="hideConfirmDialog">取消</div>
                            <div class="download-app" @click="onPayClick">确认</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <?php $this->renderPartial('/_include/tongji') ?> -->
    <script src="//res.wx.qq.com/open/js/jweixin-1.3.2.js?v=<?php echo $this->_static_version;?>"></script>
    <script type="text/javascript" src="/static/mmm/js/voucher/voucher.js?v=<?php echo $this->_static_version;?>">
    </script>
</body>

</html>
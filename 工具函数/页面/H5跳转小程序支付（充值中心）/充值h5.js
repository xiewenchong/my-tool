// 页面JS逻辑文件
/**是否正在提交订单的标识，避免重复提交订单 */
var submittingOrder = false;
var publicUrl1 = 'http://192.168.10.165:9109';
var publicUrl2 = 'http://192.168.11.220:9109';
var prevSku = {
    skuId: "",
    skuPrice: ""
};
var brandInfo = {
    1:'中国移动',
    2:'中国联通', 
    3:'中国电信'
}
var defaultGoods = [{
    spuType: 1,
    // goodsId: 2,
    // subCateTag: 100,
    goodsStatus: 1,
    skus: [{
            spec: "30元",
            // followPrice: 30,
            isDefault: true
        },
        {
            spec: "50元",
            // followPrice: 50,
            isDefault: true
        },
        {
            spec: "100元",
            // followPrice: 100,
            isDefault: true
        },
        {
            spec: "200元",
            // followPrice: 200,
            isDefault: true
        },
        {
            spec: "300元",
            // followPrice: 300,
            isDefault: true
        },
        {
            spec: "500元",
            // followPrice: 500,
            isDefault: true
        }
    ]
},
// {
//     goodsId: 1,
//     spuType: 2,
//     // subCateTag: 101,
//     goodsStatus: 1,
//     skus: {
//         skuList: [{
//             spec: "100M",
//             // followPrice: 30,
//             isDefault: true
//         },
//         {
//             spec: "300M",
//             // followPrice: 50,
//             isDefault: true
//         },
//         {
//             spec: "500M",
//             // followPrice: 100,
//             isDefault: true
//         },
//         {
//             spec: "1G",
//             // followPrice: 200,
//             isDefault: true
//         },
//         {
//             spec: "3G",
//             // followPrice: 300,
//             isDefault: true
//         },
//         {
//             spec: "10G",
//             // followPrice: 500,
//             isDefault: true
//         }
//         ]
//     }
// }
];
// 判断是否在小程序中
var isMiniProgram = function() {
    var ua = (window._navigatorUserAgent || window.navigator.userAgent).toLowerCase();
    // android可以用ua判断，ios得用__wxjs_environment
    return /miniprogram/.test(ua) || (/iphone|ipad|ipod/.test(ua) && window.__wxjs_environment === 'miniprogram');
}
/** 求两个两位浮点数的误差 */
var getFloatDiff = function(a, b) {
    return ((Number(a) * 100 - Number(b) * 100) / 100).toFixed(2);
}
//元转分  digit:倍数
var regYuanToFen = function(yuan,digit) {
    var m=0,
        s1=yuan.toString(),
        s2=digit.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}
var fenToPriceStr = function (rawFen) {
    //Log.w("","rawFen:"+rawFen);
    if (rawFen < 0) {
        return "价格小于0"; //throw new IllegalStateException("rawFen<0");
    }
    if (rawFen === 0) {
        return "0";
    }

    var yuan = /*new Number*/parseInt(rawFen / 100);
    var jiao = /*new Number*/parseInt((rawFen - yuan * 100) / 10);
    var fen = /*new Number*/rawFen - yuan * 100 - jiao * 10;
    //console.log("yuan:"+yuan+",jiao:"+jiao+",fen:"+fen);
    var sb = "";
    sb += new Number(yuan).toString();
    if (jiao > 0 || fen > 0) {
        sb += ".";
        sb += jiao; //(new Number(jiao).toString());
        if (fen > 0) {
            sb += fen; //(new Number(jiao).toString()) + ( new Number(fen).toString());
        }
    }
    return sb;
};
var trim = function(string) {
    return string ? string.replace(/^\s+|\s+$/g, '') : '';
}

var PAGE_SIZE = 6;

var app = new Vue({
    el: '#app',
    name: "page",
    data() {
        return {
            activeTab: null,
            showDownloadDialog: false,
            displayPhone: "", // 
            phone: "",
            operatorId: null, // 运营商Id
            region: "", // 归属地
            rpHasLimit: true, // 是否配置可用红包，无配置或配置0是false
            rpRemainToLimit: "",
            rpRemainValidAmount: "", // 本月剩余红包额度
            rpTotalValidAmount: "", // 本月配置可用的总红包额度
            userTotalRpAmount: "", // 用户总共的红包额度
            useRedpacket: false,
            selectedTab: 0,
            skuId: "", // 用户选择的skuId
            skuPrice: "", // 已选sku的卖价
            orderNo: "", // 提交支付后产生的订单号 不存在时需先创单
            showPayment: false,
            pageOfRecharge: 1,
            pageOfFlow: 1,
            showConfirm: false,


            isAccountBinded: false, //是否绑定手机，才能查看优惠
            isSupportJiFen: true, //支持积分  暂时写死
            JF:{
                show:false,//成功拿到优惠接口后就能展示优惠模块
                jiFenSelState: 0,//积分状态  <0 禁用  0 未勾选  1勾选
                jiFenActive: true, //积分状态（没冻结）(接口)
                jiFenRuleStr:"订单积分抵扣，即用户可在下单时可使用积分抵扣支付金额，不同会员等级决定会员积分抵扣占订单金额比例的上限（钻石50%、铂金40%、黄金30%、白银20%、普通10%）", //积分抵扣规则弹窗内容
                jiFenDesc:'',
                jiFenApplyRate: 0, //优惠最多能抵扣订单金额的百分比 (接口)
                jiFenApplyUnit: 100, //单位 100积分 == 1元
                jiFenBalance: '0', //现有积分（接口拿到的，可浮点数）(接口)
                jiFenDescPrefix:'',
                curJiFenApply: '0', //最多可用积分
                curJiFenApplyHB: '0', //最多可用红包（整数）
                jiFenDiscountCNY: '0', //最多可抵扣金额
                jifenApplyValStr: null,//积分输入框的值
                lastJiFenError: '', //积分使用不符文案
                jiFenPlaceHolder: '',
            },
            showJiFenRulePopup:false, //红包积分弹窗开关
            rechargeProduct: null, //话费数据
            flowProduct: null, //流量数据
            spuType: 1, //1话费  2流量
            loading: false,
            tipMessage: '',
            tip: false,
        };
    },
    watch: {
        phone:function(n) {
            if (n.length != 11) {
                return (this.region = "");
            }
            if (!this.phoneValid) {
                console.log('请输入有效的手机号码')
            }
            else {
                this.getPhoneRegion();
                this.computeJiFenDiscount(-1, false);
            }
        },
        operatorId:function(n) {
            this.skuId = "";
            this.skuPrice = "";
            prevSku.skuId = prevSku.skuPrice = "";
            if (n) {
                this.getProducts();
            }
        },
    },
    computed: {
        tabsClientWidth:function() {
            var arr = [],
                L = this.$refs.tabItem.length;
            if(L > 0) {
                for(var i =0; i<L;i++) {
                    arr.push(this.$refs.tabItem[i].clientWidth)
                }
            }
            return arr;
        },
        initialLeft:function() {
            var total = this.tabsClientWidth.reduce(function(prev, cur) {
                return prev + cur;
            }, 0);
            return (this.$refs.tabHead.clientWidth - total) / 2 + "px";
        },
        barTranslateX:function() {
            var activeTab = this.activeTab;
            var val = 0;
            if (activeTab === null) {
                return null;
            }
            var list = this.tabsClientWidth;
            val = list[activeTab--] / 2;
            while (activeTab >= 0) {
                val += list[activeTab--];
            }
            return `translateX(calc(${val}px - 50%))`;
        },
        phoneValid:function() {
            return !!this.phone.match(/^1\d{10}$/g);
        },
        payAmount:function() {
            // 最终需要付的钱
            return getFloatDiff(this.skuPrice, this.JF.curJiFenApplyHB);
        },
        paymentDisable:function() {
            return !this.skuId || 
            // !this.productId || 
            !this.phoneValid;
        },
        payBtnText:function() {
            return this.paymentDisable || !this.skuId ? "充值" : `支付￥${this.payAmount}充值`;
        },
        
        soldOutRechargeSku:function() {
            var arr = [];
            if(this.rechargeProduct.skus && this.rechargeProduct.skus.length > 0) {
                for(var i =0; i<this.rechargeProduct.skus.length;i++) {
                    if(this.rechargeProduct.skus[i].stockNum == 0) {
                        arr.push(this.rechargeProduct.skus[i])
                    }
                }
            }
            return arr;
        },
        soldOutFlowSku:function() {
            var arr = [];
            if(this.flowProduct.skus && this.flowProduct.skus.length > 0) {
                for(var i =0; i<this.flowProduct.skus.length;i++) {
                    if(this.flowProduct.skus[i].stockNum == 0) {
                        arr.push(this.flowProduct.skus[i])
                    }
                }
            }
            return arr;
        },
        sellingRechargeSku:function() {
            var arr = [];
            if(this.rechargeProduct.skus && this.rechargeProduct.skus.length > 0) {
                for(var i =0; i<this.rechargeProduct.skus.length;i++) {
                    if(this.rechargeProduct.skus[i].stockNum != 0) {
                        arr.push(this.rechargeProduct.skus[i])
                    }
                }
            }
            return arr;
        },
        sellingFlowSku:function() {
            var arr = [];
            if(this.flowProduct.skus && this.flowProduct.skus.length > 0) {
                for(var i =0; i<this.flowProduct.skus.length;i++) {
                    if(this.flowProduct.skus[i].stockNum != 0) {
                        arr.push(this.flowProduct.skus[i])
                    }
                }
            }
            return arr;
        },
        rechargeSku:function() {
            if (this.sellingRechargeSku.length >= 6 || this.soldOutRechargeSku.length == 0)
                return this.sellingRechargeSku.slice(0, PAGE_SIZE * this.pageOfRecharge);
            return this.sellingRechargeSku.concat(this.soldOutRechargeSku).slice(0, 6);
        },
        flowSku:function() {
            if (this.sellingFlowSku.length >= 6 || this.soldOutFlowSku.length == 0)
                return this.sellingFlowSku.slice(0, PAGE_SIZE * this.pageOfFlow);
            return this.sellingFlowSku.concat(this.soldOutFlowSku).slice(0, 6);
        },
        rechargeSkuPlaceholder:function() {
            return (3 - ((this.rechargeSku && this.rechargeSku.length % 3) || 0)) % 3;
        },
        flowSkuPlaceholder:function() {
            return (3 - ((this.flowSku && this.flowSku.length % 3) || 0)) % 3;
        },
        tabData:function() {
            var recharge = Object.assign({
                productName: "充话费",
                spuType: 1, //1话费 2流量
                // subCateTag: "100",
                // goodsId: "2"
            },
                this.rechargeProduct
            );
            // const flow = Object.assign({
            //     productName: "充流量",
            //     spuType: 2, //1话费 2流量
            //     // subCateTag: "101",
            //     // goodsId: "1"
            // },
            //     this.flowProduct
            // );

            // FIXME: side effect?
            // this.productId =
            //     this.selectedSubCate == 100 ? recharge.goodId : flow.goodId;

            // return [recharge, flow];
            return [recharge];
        },
        onShelf:function() {
            var product =
                this.spuType == 1 ?
                    this.rechargeProduct :
                    this.flowProduct;
            return product && product.goodsStatus == 1;
        }
    },
    components: {},
    methods: {
        jifenApplyInputChange: function(e) {
            var value = trim(e.target.value)
            this.JF.jifenApplyValStr = value;
        },
        /**
         * 点击优惠说明
         */
        onShowPromotionDescPopup:function () {
        },
         /**
         * 点击重新加载优惠
         */
        onDiscountLoadingBarClicked:function () {},
        /**
         * 点击积分
         */
        onJiFenClicked:function () {
            if( this.JF.jiFenSelState<0){// 积分禁用，不可点击
                return;
            }else if( this.JF.jiFenSelState===0){//未选择，点击后按最大积分计算
                this.computeJiFenDiscount(-1,true);
            }else{ // 已选择，不使用任何积分
                this.computeJiFenDiscount(0,false);
            }
        },
        //计算积分
        computeJiFenDiscount: function(targetApplyVal,showToast) {
            /// 100积分当1元，所以把1积分看成1分钱就行了
            var jifen_bian_hongbao = function(jf_in){
                return fenToPriceStr(jf_in)
            }
            this.JF.jiFenPlaceHolder ="请输入" + jifen_bian_hongbao(this.JF.jiFenApplyUnit) + "的整数倍";
            var maxVal = 0,  //当前优惠，可能后面会有别的优惠，都统一在这里计算累加起来
                curBalance = this.JF.jiFenBalance,  //当前现有积分
                val = this.getMaxJiFenApply(regYuanToFen(this.skuPrice,100),curBalance);
                if(val>0) {
                    maxVal += val;
                    curBalance -= val;
                }
            if( maxVal>0){
                this.JF.jiFenDesc = "最多可用" + jifen_bian_hongbao(maxVal) + "元红包抵扣" + maxVal / this.JF.jiFenApplyUnit + "元";
            }else{
                this.JF.jiFenDesc = "每"+ jifen_bian_hongbao(this.JF.jiFenApplyUnit) +"元红包可抵扣1元";
            }

            this.JF.curJiFenApply = val;
            this.JF.jiFenSelState = 0;
            var curApply=0; // 记录当前积分使用值

            if( this.isSupportJiFen===false ){
                this.JF.jiFenDesc = "本单所有产品不支持使用红包";
                this.JF.jiFenSelState = -1;
            }else if( this.JF.jiFenActive===false){
                this.JF.jiFenDesc = "每"+ jifen_bian_hongbao(this.JF.jiFenApplyUnit) +"元红包可抵扣1元";//"积分被冻结";
                this.JF.jiFenSelState = -1;
            }else {
                while (true) {
                    if (targetApplyVal === 0) { // 用户不想使用任何积分
                        break;
                    }else if (targetApplyVal >0) {  // 用户手动输入了一个积分使用数值
                        if (maxVal <= 0) { // 所有可使用积分的套餐都无法使用积分
                            if( showToast){
                                this.toast(this.JF.lastJiFenError);
                            }
                            break;
                        }

                        if ((targetApplyVal % this.JF.jiFenApplyUnit) != 0) {
                            if( showToast) {
                                this.toast("请输入" +  jifen_bian_hongbao(this.JF.jiFenApplyUnit) + "的整数倍");
                            }
                            //break;
                            curApply = this.JF.curJiFenApply; // 重置回上次的设置值
                        }else if ( targetApplyVal > this.JF.jiFenBalance ) {
                            if( showToast) {
                                this.toast("你还没有这么多红包哦！");
                            }
                            //break;
                            curApply = this.JF.curJiFenApply; // 重置回上次的设置值
                        }else if ( targetApplyVal > maxVal) {
                            if( showToast) {
                                // var msg=jiFenApplyErrorMsg;
                                // if( Util.isEmptyStr(msg)){
                                    var msg = "当前会员等级最多只能抵扣订单金额的"+parseInt(this.JF.jiFenApplyRate*100)+"%哦";
                                // }
                                this.toast(msg);
                            }
                            curApply = maxVal;
                        } else {
                            curApply = targetApplyVal;
                        }

                    } else /*targetApplyVal==-1*/ { // 使用最大积分

                        if (maxVal <= 0) { // 所有可使用积分的套餐都无法使用积分
                            if( showToast){
                                this.toast(this.JF.lastJiFenError);
                            }
                            break;
                        }

                        curApply = maxVal;
                    }

                    // 根据产品狗要求，设置罗罗嗦嗦的描述
                    if( curApply==maxVal){
                        this.JF.jiFenDescPrefix = "最多可用"
                        this.JF.jiFenDesc = "最多可用" +  jifen_bian_hongbao(maxVal) + "元红包抵扣" + (maxVal / this.JF.jiFenApplyUnit) + "元";
                    }else{
                        this.JF.jiFenDescPrefix ="使用"
                        this.JF.jiFenDesc ="使用" +  jifen_bian_hongbao(curApply) + "元红包抵扣" + (curApply / this.JF.jiFenApplyUnit) + "元";
                    }


                    // 如果有剩余积分没有分配，则一定是计算错误
                    // if( curApplyTo !== 0 ){
                    //     throw new Error("内部积分计算错误！");
                    // }

                    this.JF.jiFenSelState = 1;
                    break;
                }//end while
            }
            this.JF.jiFenBalanceHB = jifen_bian_hongbao(this.JF.jiFenBalance)+"元"
            // this.JF.curJiFenApply = curJiFenApply
            this.JF.maxJiFenApply = maxVal;
            this.JF.curJiFenApply = curApply;
            this.JF.curJiFenApplyHB = jifen_bian_hongbao(curApply) ;
            this.JF.jifenApplyValStr = curApply>0?/*curApply*/jifen_bian_hongbao(curApply):"";
            this.JF.jiFenDiscountCNY = parseInt(curApply / this.JF.jiFenApplyUnit);
            console.log(this.JF,'积分对象。')
        },
        getMaxJiFenApply: function(inputPrice, curBalance) {
            var finalPrice = inputPrice; //此时金额单位为分
            if( finalPrice<=0){
                this.JF.lastJiFenError=("商品应付价格已达最大优惠！不能使用积分");
                return 0;
            }
            if( finalPrice < 10 * 10 * 10 ){
                this.JF.lastJiFenError=("商品应付价格不足10元，不能使用积分");
                return 0;
            }
            finalPrice =  parseInt(finalPrice * this.JF.jiFenApplyRate);
            var fpi = parseInt(finalPrice/100);// 商品价格必须》=1元整
            if( fpi<1){
                this.JF.lastJiFenError=("积分优惠价格超过商品价格！不能使用积分");
                return 0;
            }

            if( curBalance<=0 || this.JF.jiFenApplyUnit<=0 || curBalance < this.JF.jiFenApplyUnit ){
                this.JF.lastJiFenError=("积分余额不足！");
                return 0;
            }

            var maxVal = parseInt(curBalance/this.JF.jiFenApplyUnit)*this.JF.jiFenApplyUnit;
            if( maxVal<=0){
                this.JF.lastJiFenError=("积分余额不足！");
                return 0;
            }
            // 能抵扣的订单金额 与  可用的积分相比较
            var fpVal = fpi * this.JF.jiFenApplyUnit;  
            if( maxVal>=fpVal){
                return fpVal;
            }else{
                return maxVal;
            }

        },
        //
        /**
         * 点击积分规则
         */
        onJiFenRuleEntryClicked:function (e) {
            window.event? window.event.cancelBubble = true : e.stopPropagation(); 
            this.showJiFenRulePopup = true;
        },
        /**
         * 关闭积分规则弹窗
         */
        onHideJifenRulePopup:function () {
            this.showJiFenRulePopup = false;
        },
        /**
         * 点击使用积分
         */
        onJiFenApply:function () {
            var customVal = this.JF.jifenApplyValStr;
            if(customVal<=0){ // 用户输入0，表示不使用任何积分
                // jiFenUnSelectedByUsr=true;
                this.computeJiFenDiscount(0,false);
            }else{
                // jiFenUnSelectedByUsr=false;
                this.computeJiFenDiscount(customVal*100,true); //  用户输入的是红包，变为积分，扩大100
            }
            // computeFinalPrice();
            // updateUI();
        },
        /**
         * 点击绑定
         */
        onAccountBindingTipsClicked:function () {},
        toast: function(msg) {
            if(!msg) return;
            var that = this;
            that.tipMessage = msg;
            that.tip = true;
            setTimeout(function() {
                that.tipMessage = '';
                that.tip = false;
            },2500)
        },
        isSoldOut:function(stockNum) {
            return parseFloat(stockNum) == 0;
        },
        skuDisplayName:function(spec) {
            return spec.replace(this.unit(spec), "");
        },
        unit:function(spec) {
            return (spec.match(/元|M|G/) || [""])[0];
        },
        handleClick:function(sku) {
            (this.phoneValid && !!this.operatorId) && !this.isSoldOut(sku.stockNum) && 
            this.onSkuSelect(sku.skuId,sku.followPrice)
          },
        handleActiveChange:function(i, pd) {
            if(this.activeTab != i) {
                var spuType = pd.spuType;
                this.activeTab = i;
                this.onTabActiveChange({ activeTab: i, spuType:spuType })
            }
        },
        clearPhone:function() {
            this.displayPhone = "";
            this.phone = "";
            this.region = "";
            this.operatorId = null;
            this.rechargeProduct = defaultGoods[0];
            this.flowProduct = defaultGoods[1];
            this.$nextTick(() => {
                this.$refs.input.focus();
            })
        },
        onInput:function(e) {
            this.phone = e.target.value;
        },
        onFocus:function() {
            this.displayPhone = this.phone;
        },
        onBlur:function() {
            this.displayPhone = this.displayPhone.replace(/\B(?=(?:\d{4})+$)/g, ' ');
        },
        loadMoreProduct:function(subCateTag) {
            subCateTag == 100 ? this.pageOfRecharge++ : this.pageOfFlow++;
        },
        onTabActiveChange:function(activeTab, spuType) {
            this.selectedTab = activeTab;
            this.clearSku();
        },
        clearSku:function() {
            // 切换tab时保存前一个选择的sku
            [this.skuId, prevSku.skuId] = [prevSku.skuId, this.skuId];
            [this.skuPrice, prevSku.skuPrice] = [prevSku.skuPrice, this.skuPrice];
        },
        onSkuSelect:function(skuId,followPrice) {
            if(this.skuId != skuId) {
                this.skuId = skuId;
                this.skuPrice = followPrice;
                this.computeJiFenDiscount(-1, false); 
            }
        },
        getContactPermission:function() { },
        getUserPhone:function() {
            this.phone = userBindPhone || '';
            this.phone && (this.displayPhone = userBindPhone.replace(/\B(?=(?:\d{4})+$)/g, ' '))
        },
        getPhoneRegion:function() {
            var that = this;
            this.loading = true;
            $.ajax({
                url: snapiUrl + "/snp/api/common/getPhoneOperator",
                data: {
                    phone: this.phone
                },
                success: function(res) {
                    that.loading = false;
                    if (res.code == 1000) {
                        // province = (province || "") + (city || "");
                        that.region = brandInfo[res.content.brandId];
                        // that.region = (province && operatorName.replace("中国", province)) || operatorName;
                        that.operatorId = res.content.brandId;
                        // that.operatorId = operatorId;
                    } else {
                        that.operatorId = null;
                        that.toast("暂不支持充值");
                    }
                }
            })
        },
        getProducts:function() {
            this.loading = true;
            var that = this,
                operatorId = this.operatorId;
            if (!operatorId) return;
            this.pageOfFlow = 1;
            this.pageOfRecharge = 1;
            $.ajax({
                url: snapiUrl + "/snp/api/spu/beespus",
                data: {
                    brandId: this.operatorId,
                    spuType: this.spuType 
                },
                success: function(res) {
                    that.loading = false;
                    if (res.code == 1000 && res.content.length > 0) {
                        if(that.activeTab == '0' ) {
                            that.rechargeProduct = res.content[0];
                        }
                        if(that.activeTab == '1') {
                            that.flowProduct = res.content[0];
                        }
                        // that.goodsList = res.content || [];
                    } else {
                        that.toast("获取产品失败，请刷新页面重试");
                    }
                },
                error: function(e) {
                    that.loading = false;
                    that.toast(e.message);
                }
            })
        },
        //获取红包优惠
        getUserRemainRp:function() {
            var that = this;
            this.loading = true;
            // 获取用户账号红包余额
            $.ajax({
                url: w_apiUrl + "/v2/ShenNong/GetUserPromotionsForOrder",
                data: {
                    securityKey: securityKey,
                    system: w_apiSystem,
                    version:w_apiVersion
                },
                dataType: 'jsonp',
                success: function(res) {
                    if(res.statusCode == 200 && res.success) {
                        that.JF.jiFenBalance = res.data.integralBalance;
                        that.JF.jiFenApplyUnit = res.data.integralPerCNY;
                        that.JF.jiFenApplyRate = res.data.useIntegralPercent;
                        that.JF.jiFenRuleStr = res.data.creditRuleTips;
                        that.JF.jiFenActive = res.data.isIntegralActive;
                        that.JF.show = true;
                    } else{
                        that.toast(res.message);
                    }
                    that.loading = false;
                },
                error: function(e) {
                    that.loading = false;
                    that.toast('网路有问题，请重试');
                }
            });
        },
        //创单
        creatOrder: function() {
            if (submittingOrder) {
                return;
            }
            var that = this;
            this.loading = true;
            submittingOrder = true;
            var orderData = {};
            orderData.securityKey = securityKey;
            orderData.integral = this.JF.jiFenSelState == 1 ? (this.JF.curJiFenApply ?this.JF.curJiFenApply : 0) : 0; //抵扣积分
            orderData.orderAmount = this.payAmount;
            orderData.productId  = this.spuType == 1 ?this.rechargeProduct.goodsId : this.flowProduct.goodsId;
            orderData.productName  = this.spuType == 1 ?this.rechargeProduct.goodsName : this.flowProduct.goodsName;
            orderData.productPrice  = this.skuPrice;
            orderData.rechargePhoneNum  = this.phone;
            orderData.skuId = this.skuId;
            orderData.userId = userId;
            $.ajax({
                url: snapiUrl + "/snp/api/fzs/order/create",
                type: 'POST',
                data: orderData,
                dataType: 'json',
                success: function(res){
                    that.loading = false;
                    if (res.code == 1000) {
                        submittingOrder = false;
                        if (isMiniProgram()) { // 如果是小程序
                            wx && wx.miniProgram.navigateTo({
                                url: '/pages/payForM/payForM?orderNo=' + res.content.orderNo + '&isSn=true&redirect='+ encodeURIComponent(location.href)
                            });
                            return;
                        } else {}
                    } else {
                        that.toast(res.message);
                        submittingOrder = false;
                    }
                },
                error: function(e) {
                    that.loading = false;
                    submittingOrder = false;
                    that.toast('网路有问题，请重试');
                }
            });
        },
        showConfirmDialog:function() {
            this.showConfirm = true;
        },
        hideConfirmDialog:function() {
            this.showConfirm = false;
        },
        onPayClick:function() {
            this.showConfirm = false;
            if (!this.skuId) {
                return this.toast("请选择产品！");
            } 
            this.creatOrder();
        },
    },

    created() {
        // 缓存响应式数据
        this.rechargeProduct = defaultGoods[0];
        this.flowProduct = defaultGoods[1];
        this.getUserPhone();
    },
    mounted() {
        this.activeTab = 0;
        this.getUserRemainRp();
        
    },
    filters: {
        int:function(v) {
            return parseFloat(v);
        }
    }
});
import Vue from 'vue'
import Vuex from 'vuex'
import dineIn from "@/assets/images/dine_in_icon.png";
import takeAway from "@/assets/images/take_away_icon.png";
import Cache from '@/js/api/cache.js'
var expireSec = 1000 * 60 * 60 * 24 * 3;  //3天
//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
	state: {
		imgDomin: 'https://imgorder.kfc.com.cn/mwos/Version/L/', //肯德基图片域名
		
		allCityList: JSON.parse(Cache.get('kfc_allCityList')) || {}, //所有城市，接口获取的

		locationAccuracy: Cache.get('kfc_locationAccuracy') || false,
		userLocation: JSON.parse(Cache.get('globalUserLocationInfo')) || {},
		currentCityObj: JSON.parse(Cache.get('kfc_currentCityObj')) || {
			latitude: "23.129163",
			longitude: "113.264435",
			cityName: "广州",
			cityCode: "440100",
			provinceCode: "440000",
			provinceName: "广东",
		}, //当前选中城市

		//选则门店信息
		orderObj: {
			//点餐方式 0堂食1外送
			orderWays: [
				{
					id: 0,
					name: "店内就餐",
					icon: dineIn,
					en: "Dine In",
				},
				{
					id: 1,
					name: "打包带走",
					icon: takeAway,
					en: "Take Away",
				},
			],
			takeout: 1, //默认打包带走
			selectInfo: JSON.parse(Cache.get('kfc_mendianObj')) || null, //选中的门店信息
		},

		// infos: null, //所有商品
		currentProduct: null,// 当前选中的产品
		cartProducts: {
			amount: 0,
			total: 0,
			saleAmount: 0,
			products: {}
		}, //购物车里面的物品

		fold: true, //标记购物车弹层折叠或展开的状态,true表示折叠
		productSkuDialogShow: false, //产品规格弹窗
		showSetProducts: false, //多规格产品页面

		//存放的键值对就是所要管理的状态
		userInfo: Cache.get('kfc_userInfo') || null
	},
	getters: {
		kpAliveRouter: state => state.kpAliveRouter
	},
	mutations: {
		setUserInfo(state,info) {
			state.userInfo = info;
			Cache.put('kfc_userInfo', JSON.stringify(info))
		},
		//更改位置授权结果
		updataLocationAccuracy(state, flag) {
			state.locationAccuracy = flag;
			Cache.put('kfc_locationAccuracy', flag, expireSec)
		},
		// 更新当前选中城市
		updataCurretCity(state, obj) {
			state.currentCityObj = obj;
			Cache.put('kfc_currentCityObj', JSON.stringify(obj))
		},
		updataAllCityList(state, data) {
			state.allCityList = data;
			Cache.put('kfc_allCityList', JSON.stringify(data))
		},
		//更改就餐方式
		selectOrderWay(state, way) {
			state.orderObj.takeout = way;
		},
		//更新选中门店信息
		updataOrderInfo(state, obj) {
			state.orderObj.selectInfo = obj;
			Cache.put('kfc_mendianObj', JSON.stringify(obj))
		},

		//规格弹窗改变
		handleProductSkuDialogShow(state, bool) {
			state.productSkuDialogShow = bool;
		},
		//多规格产品页面显示
		handleShowSetProducts(state, bool) {
			state.showSetProducts = bool;
		},
		//更新当前选中的产品
		updataCurrentPro(state, obj) {
			state.currentProduct = obj;
		},

		//购物车相关--------------------------------------------------------
		handleFold(state, flag) {
			state.fold = flag;
		},
		//添加购物车产品
		addCartProducts(state, obj) {
			Vue.set(state.cartProducts.products, obj.id, obj.newProduct)
		},
		// 删除某个id的产品
		deleProduct(state, product) {
			Vue.delete(product, 'quantity')
			if (product.type == 2) {
				delete state.cartProducts.products[product.hashId];
			} else {
				delete state.cartProducts.products[product.productId];
			}
		},
		//清空购物车
		emptyCartPro(state) {
			for (let pro in state.cartProducts.products) {
				store.commit('deleProduct', state.cartProducts.products[pro])
			}
			store.commit('sumCart')
		},
		//计算购物车价格等
		sumCart(state) {
			let total = 0;
			let amount = 0;
			let saleAmount = 0;
			for (let nProductId in state.cartProducts.products) {
				let nProduct = state.cartProducts.products[nProductId];
				total += nProduct.quantity;
				amount += nProduct.showPrice * nProduct.quantity;
				saleAmount += nProduct.salePrice * nProduct.quantity;
				if (nProduct.addonPrice > 0) {
					amount += nProduct.addonPrice * nProduct.quantity;
					saleAmount += nProduct.addonPrice * nProduct.quantity;
				}
			}
			state.cartProducts.total = total;
			state.cartProducts.amount = amount.toFixed(2);
			state.cartProducts.saleAmount = saleAmount.toFixed(2);
		},
	}
})

export default store

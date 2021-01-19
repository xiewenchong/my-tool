import databus from './databus';
// 获取城市列表
export const getAllCity = (data) => databus({
    url: '/api/shenga/getAllCity',
    method: 'GET',
    params: {
        ...data,
    },
});
//获取周边门店
export const getNearby = (data) => databus({
    url: '/api/shenga/search/store/nearby',
    method: 'GET',
    params: {
        ...data,
    },
});
//搜索门店
export const getSuggest = (data) => databus({
    url: '/api/shenga/search/store/suggest',
    method: 'GET',
    params: {
        ...data,
    },
});

// 获取商品列表
export const getStoreMenu = (data) => databus({
    url: '/api/shenga/getStoreMenu',
    method: 'POST',
    data: {
        ...data,
    },
});
//检查商品库存价格
export const getPrices = (data) => databus({
    url: '/api/shenga/getPrices',
    method: 'POST',
    data: {
        ...data,
    },
});
//下单
export const addOrder = (data) => databus({
    url: '/api/shenga/addOrder',
    method: 'POST',
    data: {
        ...data,
    },
});

//获取用户信息
export const getCustomerName = (data) => databus({
    url: '/api/shenga/getCustomerName',
    method: 'POST',
    data: {
        ...data,
    },
});

//获取订单列表
export const getOrders = (data) => databus({
    url: '/api/shenga/getOrders',
    method: 'POST',
    data: {
        ...data,
    },
});
//获取订单详情
export const getCode = (data) => databus({
    url: '/api/shenga/getCode',
    method: 'GET',
    params: {
        ...data,
    },
});


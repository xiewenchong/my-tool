import databus from './databus';

// 退出登录
export const logout = (data) => databus({
  url: '/ycfad2014/public/logout',
  method: 'get',
  params: data,
});

// 获取分销商可切换账号列表
export const getDisSwitchList = (data) => databus({
  url: '/sipapi/user/getDisSwitchList',
  method: 'get',
  params: data,
});

// 切换账号
export const switchAccount = (data) => databus({
  url: '/sipapi/user/switchAccount',
  method: 'post',
  data,
});
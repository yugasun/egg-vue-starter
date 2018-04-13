const base = process.env.NODE_ENV === 'production' ? '/admin/' : 'http://127.0.0.1:7001/admin/';
// const base = 'http://127.0.0.1:7001/admin/';
// const base = 'http://metlife.bj2.renhe.org.cn/admin/';

const apis = {
  // 登录
  login: `${base}login`,

  // 获取用户列表
  userList: `${base}user/list`,

  // 获取奖品列表
  prizeList: `${base}prize/list`,
  prizeAdd: `${base}prize/add`,
  prizeEdit: `${base}prize/edit`,
  prizeDelete: `${base}prize/delete`,

  // 获取奖品记录列表
  prizeLogList: `${base}prize-log/list`,

  // 获取红包记录列表
  redBagLogList: `${base}red-bag-log/list`,

  // 获取奖品记录列表
  playLogList: `${base}play-log/list`,
}

export default apis;

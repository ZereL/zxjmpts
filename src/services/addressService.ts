/*
 * @Author: Hank
 * @Date: 2019-02-20 13:35:36
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-20 15:26:35
 */

import api from "./api";

/**
 * 添加地址
 */
export function requestAddAddress(payload) {
  return api.post({
    url: "/addressService/Address/create",
    payload: payload
  });
}

/**
 * 获取购物车默认地址
 */
export function fetchCartAddress(payload) {
  return api.post({
    url: "/addressService/Address/getDefaultAddress",
    payload: payload
  });
}

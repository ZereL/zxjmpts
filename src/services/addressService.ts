/*
 * @Author: Hank
 * @Date: 2019-02-20 13:35:36
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-05 10:01:43
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

/**
 * 获取地址列表
 */
export function fetchAddressList(payload) {
  return api.post({
    url: "/addressService/Address/getAddressBook",
    payload: payload
  });
}

/**
 * 获取地址
 */
export function fetchAddress(payload) {
  return api.post({
    url: "/addressService/Address/get",
    payload: payload
  });
}

/**
 * 修改地址
 */
export function modifyAddress(payload) {
  return api.post({
    url: "/addressService/Address/modify",
    payload: payload
  });
}

/**
 * 删除地址
 */
export function deleteAddress(payload) {
  return api.post({
    url: "/addressService/Address/delete",
    payload: payload
  });
}

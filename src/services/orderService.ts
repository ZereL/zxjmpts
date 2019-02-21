/*
 * @Author: Hank
 * @Date: 2019-02-20 16:38:47
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-21 09:25:42
 */
import api from "./api";

/**
 * 创建订单
 */
export function requestCreateOrder(payload) {
  return api.post({
    url: "/orderService/order/Create",
    payload: payload
  });
}

/**
 * 获取订单列表
 */
export function fetchOrderList(payload) {
  return api.post({
    url: "/orderService/order/List",
    payload: payload
  });
}

/**
 * 获取订单
 */
export function fetchOrder(payload) {
  return api.post({
    url: "/orderService/order/get",
    payload: payload
  });
}

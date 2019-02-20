/*
 * @Author: Hank
 * @Date: 2019-02-20 16:38:47
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-20 16:40:05
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
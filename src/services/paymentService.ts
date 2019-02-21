/*
 * @Author: Hank
 * @Date: 2019-02-21 15:31:06
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-21 15:33:37
 */

import api from "./api";

/**
 *
 * @param {OrderId,PaymentMethodId} payload
 * 支付订单
 */
export function payOrderByDeposit(payload) {
  return api.post({
    url: "/paymentService/payment/PayOrderByDeposit",
    payload: payload
  });
}

// /**
//  *
//  * @param {OrderId,PaymentMethodId} payload
//  * 支付订单(wechat)
//  */
export function payOrderByWechatSupay(payload) {
  return api.post({
    url: "/paymentService/payment/payOrderByWechatMinSupay/",
    payload: payload
  });
}
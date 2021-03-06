import api from "./api";

/*
 * @Author: Hank
 * @Date: 2019-02-12 11:22:55
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-22 10:30:55
 */

/**
 *
 * @param {id(SKU ID), qty} payload
 * 增（1）删（-1）购物车商品数量，服务端会在原有数量基础上增减
 * 默认更新数量会触发购物车选中此商品（如果此前未选中）
 */
export function updateCart(payload) {
  return api.post({
    url: "/cartService/cart/AddItem",
    payload: {
      // 商品SKUID
      skuId: payload.skuId,
      qty: payload.qty,
      selected: true,
      resultType: "SkuList"
    }
  });
}

/**
 * 请求购物车列表数据
 * BoolType = RESULT_TYPE_BOOL,
 * SkuList = RESULT_TYPE_SKULIST,
 * Summary = RESULT_TYPE_SUMMARY,
 */
export function fetchCartData(payload) {
  return api.post({
    url: "/cartService/cart/get",
    payload: {
      resultType:
        payload == null || payload.resultType == null
          ? "SkuList"
          : payload.resultType
    }
  });
}

/**
 * 请求购物车列表数据
 * BoolType = RESULT_TYPE_BOOL,
 * SkuList = RESULT_TYPE_SKULIST,
 * Summary = RESULT_TYPE_SUMMARY,
 */
export function modifyCart(payload) {
  console.log("modifyCart", payload);
  return api.post({
    url: "/cartService/cart/ModifyItem",
    payload: {
      // item的数组
      items: payload,
      resultType: "SkuList"
    }
  });
}

/**
 *
 * @param {id(SKU ID)} payload
 * 从购物车移除商品
 */
export function removeFromCart(payload) {
  console.log("removeFromCart", payload);
  return api.post({
    url: "/cartService/cart/RemoveItem",
    payload: {
      // 商品SKUID
      skuId: payload.id,
      resultType: "SkuList"
    }
  });
}

/**
 * 设置新的购物车地址enCode
 */
export function setLocationCode(payload) {
  console.log("setLocationCode", payload);
  return api.post({
    url: "/cartService/cart/setLocationCode",
    payload: {}
  });
}

/**
 *
 * @param {Price} payload
 * 获取付款方式
 */
// {
//   "balance": 1217,
//   "id": 1,
//   "name": "臻金",
//   "money": 0,
//   "code": "Balance"
// },
// {
//   "id": 2,
//   "name": "支付宝",
//   "money": 0,
//   "code": "AlipaySupay"
// },
// {
//   "id": 3,
//   "name": "微信支付",
//   "money": 0,
//   "code": "WechatSupay"
// }
export function getPaymentMethods(payload) {
  console.log("getPaymentMethods", payload);
  return api.post({
    url: "/paymentService/payment/List",
    payload: { ...payload, Fun: "Order" }
  });
}

// /**
//  * 设置新的购物车地址enCode
//  */
// export const setLocationCode = payload => {
//   const url = "cartService/cart/setLocationCode";

//   //开始请求数据
//   return fetchAPIWithFalseAsError(url, payload);
// };

// /**
//  *
//  * @param {id(SKU ID)} payload
//  * 从购物车移除商品
//  */
// export const removeFromCart = async payload => {
//   const url = "cartService/cart/RemoveItem";
//   const body = {
//     // 商品SKUID
//     id: payload.id,
//     resultType: RESULT_TYPE_SKULIST
//   };

//   const result = await fetchAPIWithFalseAsError(url, body);
//   return result;
// };

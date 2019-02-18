import api from "./api";

/*
 * @Author: Hank
 * @Date: 2019-02-12 11:22:55
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-19 10:17:05
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

// /**
//  *
//  * @param {id(SKU ID), qty?, selected?} payload
//  * 更新购物车商品数量及选中状态
//  * 区别于updateCart方法，此方法的数量会覆盖服务端的数量
//  * qty数量和selected选中状态均为可选参数，未传则不更新
//  */
// export const modifyCart = async payload => {
//   const url = "cartService/cart/ModifyItem";
//   let body = {
//     // item的数组
//     items: payload,
//     resultType: RESULT_TYPE_SKULIST
//   };

//   const result = await fetchAPIWithFalseAsError(url, body);
//   return result;
// };

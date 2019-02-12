import api from "./api";

/*
 * @Author: Hank
 * @Date: 2019-02-12 11:22:55
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-12 13:01:53
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

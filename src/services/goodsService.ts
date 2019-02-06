/*
 * @Author: Hank 
 * @Date: 2019-02-07 10:10:09 
 * @Last Modified by:   Hank 
 * @Last Modified time: 2019-02-07 10:10:09 
 */
import api from "./api";

// 获取首页数据
export function fetchGoodsData(payload) {
  const { id } = payload;
  console.log("fetchGoodsDataId", id);
  return api.post({
    url: "/goodsService/Goods/Get",
    payload: {
      id: id
    }
  });
}

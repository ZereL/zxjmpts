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

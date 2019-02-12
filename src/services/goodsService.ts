/*
 * @Author: Hank
 * @Date: 2019-02-07 10:10:09
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-12 15:10:09
 */
import api from "./api";

// 获取单品数据
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

// 获取商品列表数据
export function fetchGoodsListData(payload) {
  const { pageSize, currentPage, brandId, cateId, keyword } = payload;
  console.log("keyword", keyword);
  return api.post({
    url: "/goodsService/goods/list",
    payload: {
      pageSize: pageSize || 14,
      currentPage: currentPage || 1,
      brandId: brandId || null,
      cateId: cateId || null,
      keyword: keyword || null
    }
  });
}

// 获取入门商品列表
export function fetchEntryGoodsListData(payload) {
  const { pageSize, currentPage } = payload;
  return api.post({
    url: "/goodsService/goods/list",
    payload: {
      pageSize: pageSize == null ? 12 : pageSize,
      currentPage: currentPage == null ? 1 : currentPage,
      isEntry: true
    }
  });
}

/*
 * @Author: Hank
 * @Date: 2019-02-07 10:10:09
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-06 11:36:44
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
  const {
    pageSize,
    currentPage,
    brandId,
    cateId,
    keyword,
    isFavorite
  } = payload;
  console.log("keyword", keyword);
  return api.post({
    url: "/goodsService/goods/list",
    payload: {
      pageSize: pageSize || 14,
      currentPage: currentPage || 1,
      brandId: brandId || null,
      cateId: cateId || null,
      keyword: keyword || null,
      isFavorite: isFavorite || null
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

// 获取入门商品列表
export async function addFavorite(payload) {
  const { id } = payload;
  const requestResult = await api.post({
    url: "/goodsService/favorite/add",
    payload: {
      id: id
    }
  });

  // 请求成功
  if (requestResult.success) {
    return requestResult;
  } else if (!requestResult.success && requestResult.message) {
    console.log("添加购物车失败,用户可能需要登录", requestResult);
    return requestResult;
  } else {
    console.log(requestResult);
    throw new Error("删除收藏失败");
  }
}
  
// 请求删除收藏商品
export async function delFavorite(payload) {
  const { id } = payload;
  const requestResult = await api.post({
    url: "/goodsService/favorite/remove",
    payload: {
      id: id
    }
  });

  // 请求成功
  if (requestResult.success) {
    return requestResult;
  } else if (!requestResult.success && requestResult.message) {
    console.log("添加购物车失败,用户可能需要登录", requestResult);
    return requestResult;
  } else {
    console.log(requestResult);
    throw new Error("删除收藏失败");
  }
}

// /**
//  * 请求删除收藏商品
//  */
// export const delFavorite = async payload => {
//   const url = "goodsService/favorite/remove";
//   const body = {
//     id: payload.id
//   };

//   // 开始请求数据
//   const requestResult = await fetchAPI(url, body);

//   // 请求成功
//   if (requestResult.success) {
//     return requestResult;
//   } else if (!requestResult.success && requestResult.message) {
//     console.log("添加购物车失败,用户可能需要登录", requestResult);
//     return requestResult;
//   } else {
//     console.log(requestResult);
//     throw new Error("删除收藏失败");
//   }
// };

// /**
//  * 请求加入收藏商品
//  */
// export const addFavorite = async payload => {
//   const url = "goodsService/favorite/add";
//   const body = {
//     id: payload.id
//   };

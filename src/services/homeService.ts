import api from "./api";

// 获取首页数据
export function fetchHomeData() {
  return api.post({
    url: "/templateService/page/home"
  });
}
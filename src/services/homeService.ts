/*
 * @Author: Hank 
 * @Date: 2019-02-07 10:10:12 
 * @Last Modified by:   Hank 
 * @Last Modified time: 2019-02-07 10:10:12 
 */
import api from "./api";

// 获取首页数据
export function fetchHomeData() {
  return api.post({
    url: "/templateService/page/home"
  });
}
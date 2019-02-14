/*
 * @Author: Hank
 * @Date: 2019-02-07 10:10:06
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-15 11:41:42
 */
import Taro from "@tarojs/taro";
// import qs from "qs";
import { BASE_URL, HTTP_ERROR } from "../config/index";
import { getGlobalData } from "../utils/common";

/**
 * 检查http状态值
 * @param response
 * @returns {*}
 */
function checkHttpStatus(response: API.Response) {
  // TODO: 这个不懂为什么能拿到response
  console.log("response", response);
  if (response.statusCode >= 200 && response.statusCode < 300) {
    Taro.hideNavigationBarLoading();
    return response.data;
  }

  const message =
    HTTP_ERROR[response.statusCode] || `ERROR CODE: ${response.statusCode}`;
  const error: any = new Error(message);
  error.response = response;
  throw error;
}

/**
 * 检查返回值是否正常
 * @param data
 * @returns {*}
 */
function checkSuccess(data: any, resolve, reject) {
  // TODO： 不懂ArrayBuffer是什么。
  if (data instanceof ArrayBuffer && typeof data === "string") {
    return data;
  }

  if (typeof data.resultCode === "number" && data.resultCode === 0) {
    return resolve(data);
  }

  // just for kevin的接口，明天改了接口就改回去
  if (typeof data.resultCode === "number" && data.resultCode === 200) {
    return resolve(data);
  }

  // just for 张博金 的接口，明天改了接口就改回去
  if (typeof data.resultCode === "number" && data.resultCode === 100) {
    return resolve(data);
  }

  // 原来的返回错误代码，但是DVA捕捉不到错误
  const error: any = new Error(data.message || "服务端返回异常");
  error.data = data;
  throw error;

  // const error: any = new Error(data.message || "服务端返回异常");
  // error.errMsg = data;
  // throwResultCodeError(error, reject);
}

// /**
//  * 请求错误处理
//  * @param error
//  * @param reject
//  */
// function throwResultCodeError(error, reject) {
//   Taro.hideNavigationBarLoading();
//   if (error.errMsg) {
//     reject("服务器正在维护中!");
//   }
// }

/**
 * 请求错误处理
 * @param error
 * @param reject
 */
function throwError(error, reject) {
  Taro.hideNavigationBarLoading();
  if (error.errMsg) {
    reject("服务器正在维护中!");
    throw new Error("服务器正在维护中!");
  }
  throw error;
}

export default {
  request(options: any, method?: string) {
    const { url } = options;
    // 拿到登录token
    const authToken = getGlobalData("token");
    return new Promise((resolve, reject) => {
      Taro.showNavigationBarLoading();
      Taro.request({
        ...options,
        method: method || "POST",
        url: `${BASE_URL}${url}`,
        header: {
          "content-type": "application/json",
          Authorization: "Bearer " + authToken,
          ...options.header
        }
      })
        // TODO: 不明白为什么改变api.d.ts中的接口属性这里就会报错。
        .then(checkHttpStatus)
        .then(res => {
          //   console.log("result", res);
          checkSuccess(res, resolve, reject);
        })
        .catch(error => {
          throwError(error, reject);
        });
    });
  },
  get(options: any) {
    return this.request(
      {
        ...options
      },
      "GET"
    );
  },
  post(options: any) {
    return this.request(
      {
        ...options,
        data: JSON.stringify(options.payload)
      },
      "POST"
    );
  }
};

import Taro from "@tarojs/taro";
// import qs from "qs";
import { BASE_URL, HTTP_ERROR } from "../config/index";

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
function checkSuccess(data: any, resolve) {
  // TODO： 不懂ArrayBuffer是什么。
  if (data instanceof ArrayBuffer && typeof data === "string") {
    return data;
  }

  if (typeof data.resultCode === "number" && data.resultCode === 0) {
    return resolve(data);
  }

  const error: any = new Error(data.message || "服务端返回异常");
  error.data = data;
  throw error;
}

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
    console.log("请求URL", `${BASE_URL}${url}`);
    return new Promise((resolve, reject) => {
      Taro.showNavigationBarLoading();
      Taro.request({
        ...options,
        method: method || "POST",
        url: `${BASE_URL}${url}`,
        header: {
          "content-type": "application/json",
          ...options.header
        }
      })
        // TODO: 不明白为什么改变api.d.ts中的接口属性这里就会报错。
        .then(checkHttpStatus)
        .then(res => {
          //   console.log("result", res);
          checkSuccess(res, resolve);
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
        data: JSON.stringify(options.data)
      },
      "POST"
    );
  }
};

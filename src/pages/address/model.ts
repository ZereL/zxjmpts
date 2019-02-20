import { defaultGoodsImage } from "./../../config/index";
/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:21
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-20 15:59:26
 */

import {
  REQUEST_LOGIN,
  FETCH_PAGEDATA,
  SET_PAGEDATA,
  REQUEST_ADDADDRESS,
  FETCH_CARTADDRESS
} from "./../../constants/index";
import Taro from "@tarojs/taro";
import { fetchCartData } from "../../services/cartService";
import {
  requestAddAddress,
  fetchCartAddress
} from "../../services/addressService";

export default {
  namespace: "address",
  state: {},
  reducers: {
    [SET_PAGEDATA](state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *[FETCH_PAGEDATA]({ payload }, { select, put, call }) {
      const requestResult = yield call(fetchCartData, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;

      yield put({
        type: SET_PAGEDATA,
        payload: requestResultData
      });
      return requestResult;
    },
    *[REQUEST_LOGIN]({ payload }, {}) {
      console.log("收到请求", payload);
      Taro.login().then(result => {
        console.log("result请求", result);
      });
    },
    *[REQUEST_ADDADDRESS]({ payload }, { call }) {
      console.log("收到请求", payload);
      const requestResult = yield call(requestAddAddress, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;

      return requestResultData;
    },
    *[FETCH_CARTADDRESS]({ payload }, { call, put }) {
      console.log("收到请求", payload);
      const requestResult = yield call(fetchCartAddress, payload);
      console.log("requestResult", requestResult);
      const defaultAddress = requestResult.data;
      yield put({
        type: SET_PAGEDATA,
        payload: { defaultAddress }
      });
      return defaultAddress;
    }
  }
};

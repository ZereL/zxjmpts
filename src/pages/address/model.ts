import { defaultGoodsImage } from "./../../config/index";
/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:21
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-05 14:11:03
 */

import {
  REQUEST_LOGIN,
  FETCH_PAGEDATA,
  SET_PAGEDATA,
  REQUEST_ADDADDRESS,
  FETCH_CARTADDRESS,
  FETCH_MOREPAGEDATA,
  REQUEST_MODIFY_ADDRESS,
  REQUEST_DELETE_ADDRESS
} from "./../../constants/index";
import Taro from "@tarojs/taro";
import {
  requestAddAddress,
  fetchCartAddress,
  fetchAddressList,
  modifyAddress,
  deleteAddress
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
      const requestResult = yield call(fetchAddressList, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;

      yield put({
        type: SET_PAGEDATA,
        payload: requestResultData
      });
      return requestResult;
    },
    *[FETCH_MOREPAGEDATA]({ payload }, { select, put, call }) {
      // 当前列表数据
      const currentState = yield select(state => state.goodsList);
      // console.log("currentState", currentState);
      const currentList = currentState.items;

      // 请求返回所有数据
      const requestResult = yield call(fetchAddressList, payload);
      console.log("requestResult", requestResult);
      // 请求返回的data
      const requestResultData = requestResult.data;
      // 请求返回的产品列表
      const fetchlist = requestResult.data.items;
      // 新的产品列表数据
      const newList = currentList.concat(fetchlist);
      console.log("newList", newList);

      yield put({
        type: SET_PAGEDATA,
        payload: {
          ...currentState,
          ...requestResultData,
          items: newList
        }
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
    *[REQUEST_MODIFY_ADDRESS]({ payload }, { call }) {
      console.log("收到请求", payload);
      const requestResult = yield call(modifyAddress, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;

      return requestResultData;
    },
    *[REQUEST_DELETE_ADDRESS]({ payload }, { call }) {
      console.log("收到请求", payload);
      const requestResult = yield call(deleteAddress, payload);
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

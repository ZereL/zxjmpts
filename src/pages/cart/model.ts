/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:21
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-15 17:27:20
 */
import { CART } from "../../constants";
import {
  REQUEST_LOGIN,
  ADD,
  FETCH_PAGEDATA,
  SET_PAGEDATA
} from "./../../constants/index";
import Taro from "@tarojs/taro";
import { fetchCartData } from "../../services/cartService";

export default {
  namespace: CART,
  state: {
    num: 1
  },
  reducers: {
    SetAdd(state, { payload }) {
      return { ...state, ...payload };
    },
    [SET_PAGEDATA](state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *[ADD]({ payload }, { select, put, call }) {
      console.log("收到请求", payload);
      const { num } = yield select(state => state.home);
      console.log("准备请求");
      const requestResult = yield call(fetchCartData);
      console.log("requestResult", requestResult);

      yield put({
        type: "SetAdd",
        payload: {
          num: num + 1
        }
      });

      return requestResult;
    },
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
    }
  }
};

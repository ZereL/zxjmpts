/*
 * @Author: Hank
 * @Date: 2019-02-20 16:33:05
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-22 10:20:11
 */

import {
  FETCH_PAGEDATA,
  SET_PAGEDATA,
  REQUEST_CREATEORDER,
  REQUEST_PAYORDER
} from "./../../constants/index";
import {
  requestCreateOrder,
  fetchOrderList
} from "../../services/orderService";
import { payOrderByDeposit } from "../../services/paymentService";

export default {
  namespace: "order",
  state: {
    items: []
  },
  reducers: {
    [SET_PAGEDATA](state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *[FETCH_PAGEDATA]({ payload }, { select, put, call }) {
      const requestResult = yield call(fetchOrderList, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;
      yield put({
        type: SET_PAGEDATA,
        payload: requestResultData
      });
      return requestResult;
    },
    *[REQUEST_CREATEORDER]({ payload }, { call, put, select }) {
      console.log("收到请求创建订单", payload);

      const requestResult = yield call(requestCreateOrder, payload);
      const requestResultData = requestResult.data;
      console.log("REQUEST_CREATEORDER", requestResultData);
      return requestResultData;

      // yield put({
      //   type: SET_CREATE_ORDER,
      //   payload: result
      // });
      // return yield select(state => state.orders.createResult);
    },
    *[REQUEST_PAYORDER]({ payload }, { call, put, select }) {
      console.log("收到请支付订单", payload);

      const requestResult = yield call(payOrderByDeposit, payload);
      const requestResultData = requestResult.data;
      console.log("REQUEST_CREATEORDER", requestResultData);
      return requestResultData;

      // yield put({
      //   type: SET_CREATE_ORDER,
      //   payload: result
      // });
      // return yield select(state => state.orders.createResult);
    }
  }
};

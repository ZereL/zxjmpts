/*
 * @Author: Hank
 * @Date: 2019-02-20 16:33:05
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-08 14:48:29
 */

import {
  FETCH_PAGEDATA,
  SET_PAGEDATA,
  REQUEST_CREATEORDER,
  REQUEST_PAYORDER,
  CLEAR_PAGEDATA
} from "./../../constants/index";
import {
  requestCreateOrder,
  fetchOrderList
} from "../../services/orderService";
import {
  payOrderByDeposit,
  payOrderByWechatSupay
} from "../../services/paymentService";

export default {
  namespace: "order",
  state: {
    items: []
  },
  reducers: {
    [SET_PAGEDATA](state, { payload }) {
      return { ...state, ...payload };
    },
    [CLEAR_PAGEDATA](state, {}) {
      console.log("state", state);
      return {
        items: []
      };
    }
  },
  effects: {
    *[FETCH_PAGEDATA]({ payload }, { select, put, call }) {
      console.log("收到请求payload", payload);
      const requestResult = yield call(fetchOrderList, payload);
      console.log("requestResult!!!!!!!!!", requestResult);
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

      const { paymentConfigId } = payload;
      if (paymentConfigId == 1) {
        const requestResult = yield call(payOrderByDeposit, payload);
        console.log("payOrderByDeposit", requestResult);
        const requestResultData = requestResult.data;
        console.log("REQUEST_CREATEORDER", requestResultData);
        return requestResultData;
      } else if (paymentConfigId == 3) {
        const requestResult = yield call(payOrderByWechatSupay, payload);
        console.log("payOrderByWechatSupay", requestResult);
        const requestResultData = requestResult.data;
        console.log("REQUEST_CREATEORDER", requestResultData);
        return requestResultData;
      } else {
        console.log("支付方式不支持");
      }

      // yield put({
      //   type: SET_CREATE_ORDER,
      //   payload: result
      // });
      // return yield select(state => state.orders.createResult);
    }
  }
};

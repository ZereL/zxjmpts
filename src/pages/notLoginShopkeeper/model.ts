/*
 * @Author: Hank
 * @Date: 2019-02-08 15:12:38
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-14 17:06:19
 */

import { GOODSLIST } from "./../../constants/index";
import {
  FETCH_PAGEDATA,
  SET_PAGEDATA,
  FETCH_MOREPAGEDATA,
  REQUEST_REGISTERUID,
  REQUEST_REGISTERWECHAT
} from "./../../constants/index";
import { fetchGoodsListData, fetchEntryGoodsListData } from "../../services/goodsService";
import { requestRegisterUid, requestRegisterWeChat } from "../../services/memberService";

export default {
  namespace: 'notLoginShopkeeper',
  state: {
    num: 1,
    homeItems: []
  },
  reducers: {
    [SET_PAGEDATA](state, { payload }) {
      console.log("SET_PAGEDATA, payload", payload);
      return { ...state, ...payload };
    }
  },
  effects: {
    *[FETCH_PAGEDATA]({ payload }, { put, call }) {
      const requestResult = yield call(fetchEntryGoodsListData, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;

      yield put({
        type: SET_PAGEDATA,
        payload: requestResultData
      });
      return requestResult;
    },
    *[REQUEST_REGISTERUID]({ payload }, { put, call }) {
      console.log('payload荷载', payload);
      const requestResult = yield call(requestRegisterUid, payload);
      console.log("requestResult", requestResult);
      // const requestResultData = requestResult.data;

      // yield put({
      //   type: SET_PAGEDATA,
      //   payload: requestResultData
      // });
      return requestResult;
    },
    *[REQUEST_REGISTERWECHAT]({ payload }, { put, call }) {
      const requestResult = yield call(requestRegisterWeChat, payload);
      console.log("requestResult", requestResult);
      // const requestResultData = requestResult.data;

      // yield put({
      //   type: SET_PAGEDATA,
      //   payload: requestResultData
      // });
      return requestResult;
    },
    *[FETCH_MOREPAGEDATA]({ payload }, { select, put, call }) {
      // 当前列表数据
      const currentState = yield select(state => state.goodsList);
      // console.log("currentState", currentState);
      const currentList = currentState.items;

      // 请求返回所有数据
      const requestResult = yield call(fetchEntryGoodsListData, payload);
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
    }
  }
};
